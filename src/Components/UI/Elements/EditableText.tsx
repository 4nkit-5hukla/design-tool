import Konva from "konva";
import { Text, Transformer } from "react-konva";
import { Html, Portal } from "react-konva-utils";
import { KonvaEventObject } from "konva/lib/Node";
import { FC, useRef, useEffect, useState, RefObject, CSSProperties } from "react";

import { useTransformer } from "Hooks";
import { useElementsContext } from "Contexts/Elements";
import { TextElement } from "Interfaces/Elements";

interface DivProps {
  style: CSSProperties;
}

interface TextareaProps {
  style: CSSProperties;
}

interface EditableTextProps {
  onDragMove: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onTransform: (config: Partial<TextElement>) => void;
  onMouseDown?: (e: KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (config: Partial<TextElement>) => void;
  editText: boolean;
  toggleEditText: (edit: boolean) => void;
  isSelected: boolean;
  stage: Konva.Stage;
  id: string;
  text: string;
  draggable: boolean;
  lock?: boolean;
  useList?: boolean;
  listType?: string;
  canvasHeight: number;
  canvasWidth: number;
  name: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  textDecoration?: string;
  fill?: string;
  align?: string;
  lineHeight?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  width?: number;
  height?: number;
  opacity?: number;
  strokeEnabled?: boolean;
  stroke?: string;
  strokeWidth?: number;
  shadowEnabled?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
}

const EditableText: FC<EditableTextProps> = ({
  onDragMove,
  onDragEnd,
  onClick,
  onTransform,
  onMouseDown,
  onTransformEnd,
  editText,
  toggleEditText,
  isSelected,
  stage,
  id,
  text,
  draggable,
  lock = false,
  useList = false,
  listType,
  canvasHeight,
  canvasWidth,
  name,
  ...props
}) => {
  const { focused, setFocused, unFocus } = useElementsContext();

  const elementRef = useRef<Konva.Text>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const transformerRef = useRef<Konva.Transformer>(null) as RefObject<Konva.Transformer>;
  const [created, setCreated] = useState<boolean>(false);
  
  const applyList = (text: string, listType: string) =>
    text
      .split("\n")
      .map((line: string, index: number) =>
        line.includes(`• `)
          ? line
          : line.includes(`${index + 1}. `)
            ? line
            : listType === "ul"
              ? `• ${line}`
              : listType === "ol"
                ? `${index + 1}. ${line}`
                : line
      )
      .join("\n");
  
  const [divProps, setDivProps] = useState<DivProps>({
    style: {
      display: "none",
      position: "absolute",
    },
  });

  const [textareaProps, setTextareaProps] = useState<TextareaProps>({
    style: {
      display: "block",
      border: "none",
      padding: "0px",
      margin: "0px",
      overflow: "hidden",
      background: "none",
      outline: "none",
      resize: "none",
      height: undefined,
      fontSize: undefined,
      lineHeight: undefined,
      fontFamily: undefined,
      textAlign: undefined,
      color: undefined,
      transform: undefined,
      transformOrigin: "left top",
      width: "100%",
      wordBreak: "keep-all",
    },
  });

  const [originValue, setOriginValue] = useState<string>(text);
  const [textareaValue, setTextareaValue] = useState<string>(originValue);

  useTransformer({
    isSelected,
    ref: elementRef,
    transformer: transformerRef,
  });

  useEffect(() => {
    if (!created) {
      const element = elementRef.current;
      if (element) element.width(element.width() * 1.05);
      setCreated(true);
      return;
    }

    if (focused === null && elementRef.current) {
      if (originValue !== textareaValue) {
        onTransform({
          id,
          text: textareaValue,
        } as Partial<TextElement>);
      }
      setDivProps({
        style: {
          ...divProps.style,
          display: "none",
        },
      });

      elementRef.current.show();
    }
  }, [focused]);

  const handleTextDblClick = (_: KonvaEventObject<MouseEvent>) => {
    if (!elementRef.current) return;
    toggleEditText(true);
    elementRef.current.hide();

    const textPosition = elementRef.current.absolutePosition();

    const areaPosition = {
      x: stage.offsetX() + textPosition.x,
      y: stage.offsetY() + textPosition.y,
    };

    const updatedDivProps: DivProps = {
      ...divProps,
    };

    setOriginValue(textareaValue);

    const updatedTextareaProps: TextareaProps = {
      ...textareaProps,
      style: {
        ...textareaProps.style,
      },
    };

    const getTransform = () => {
      if (!elementRef.current) return;
      const rotation = elementRef.current.rotation();

      let transform = "";
      if (rotation) {
        transform += `rotateZ(${rotation}deg)`;
      }

      let px = 0;

      const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        px += 2 + Math.round(elementRef.current.fontSize() / 20);
      }

      transform += `translateY(-${px}px)`;

      return transform;
    };

    updatedDivProps.style = {
      ...divProps.style,
      width: `${elementRef.current.width() - elementRef.current.padding() * 2}px`,
      height: `${elementRef.current.height() - elementRef.current.padding() * 2 + 5}px`,
      position: "absolute",
      display: "block",
      left: `${areaPosition.x}px`,
      top: `${areaPosition.y}px`,
      filter: `brightness(${elementRef.current.brightness() + 1})`,
    };

    updatedTextareaProps.style = {
      ...textareaProps.style,
      fontSize: `${elementRef.current.fontSize()}px`,
      lineHeight: elementRef.current.lineHeight(),
      fontFamily: elementRef.current.fontFamily(),
      textAlign: (elementRef.current.align() || "left") as CSSProperties["textAlign"],
      color: (typeof elementRef.current.fill() === "string" ? elementRef.current.fill() : "#000000") as string,
      transform: getTransform(),
      height: updatedDivProps.style.height,
      ...(elementRef.current.strokeEnabled()
        ? {
            WebkitTextFillColor: (typeof elementRef.current.fill() === "string" ? elementRef.current.fill() : "#000000") as string,
            WebkitTextStrokeColor: (typeof elementRef.current.stroke() === "string" ? elementRef.current.stroke() : "#000000") as string,
            WebkitTextStrokeWidth: `${elementRef.current.strokeWidth()}px`,
          }
        : {}),
      ...(elementRef.current.fontStyle() === "bold"
        ? {
            fontWeight: "bold",
          }
        : {}),
      ...(elementRef.current.fontStyle() === "italic" ? { fontStyle: "italic" } : {}),
      ...(elementRef.current.textDecoration() === "underline"
        ? { textDecoration: "underline", textDecorationThickness: "from-font" }
        : {}),
    };

    setDivProps(updatedDivProps);
    setTextareaProps(updatedTextareaProps);
    setTextareaValue(elementRef.current.text());

    if (textareaRef.current) textareaRef.current.focus();
  };

  const removeTextarea = () => {
    setDivProps({
      ...divProps,
      style: {
        ...divProps.style,
        display: "none",
      },
    });
  };

  const onBlurHandler = () => {
    if (!elementRef.current) return;
    removeTextarea();
    elementRef.current.show();
    unFocus();
    toggleEditText(false);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!elementRef.current) return;
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";

    textareaRef.current.style.height = `${textareaRef.current.scrollHeight + elementRef.current.fontSize()}px`;

    setDivProps({
      style: {
        ...divProps.style,
        height: `${textareaRef.current.scrollHeight + elementRef.current.fontSize()}px`,
      },
    });

    if (listType) setTextareaValue(useList ? applyList(e.target.value, listType) : e.target.value);
  };

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    if (elementRef.current)
      setDivProps({
        style: {
          ...divProps.style,
          height: `${textareaRef.current.scrollHeight + elementRef.current.fontSize()}px`,
        },
      });
  }, [textareaValue]);

  useEffect(() => {
    if (transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const rotater = transformerRef.current.findOne(".rotater");
      if (rotater && stage)
        rotater.on("mouseenter", () => {
          stage.content.style.cursor = `url("data:image/svg+xml,%3Csvg%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M11.8597%2017.3593L11.652%2017.395V17.6057V19.5921L5.12661%2016.2681L11.652%2012.9441V14.7281V15.0506L11.9643%2014.9702C14.9074%2014.2131%2017.0994%2011.7875%2017.0994%208.88374C17.0994%205.36349%2013.8862%202.54885%2010%202.54885C6.11384%202.54885%202.9006%205.36349%202.9006%208.88374C2.9006%209.73835%203.08658%2010.5636%203.45294%2011.3393L1.06179%2012.3371C0.52252%2011.2457%200.25%2010.0857%200.25%208.88383C0.250101%204.15038%204.59557%200.25%2010.0001%200.25C15.4046%200.25%2019.75%204.15038%2019.75%208.88383C19.75%2013.0601%2016.3711%2016.5844%2011.8597%2017.3593Z%27%20fill%3D%27%23fff%27%20stroke%3D%27%23000%27%20stroke-width%3D%270.5%27%2F%3E%3C%2Fsvg%3E") 10 10, auto`;
        });
    }
  }, [transformerRef]);

  return (
    <>
      <Text
        {...props}
        name={name}
        text={text}
        id={id}
        ref={elementRef}
        draggable={!lock ? draggable : false}
        onDblClick={(e) => {
          setFocused(id);
          handleTextDblClick(e);
        }}
        onClick={onClick}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onTransform={() => {
          const node = elementRef.current;
          if (!node) return;
          if (Math.ceil(node.height() * node.scaleY()) === Math.ceil(node.height())) {
            node.setAttrs({
              scaleX: 1,
              width: node.width() * node.scaleX(),
              height: "auto",
            });
            onTransform({} as Partial<TextElement>);
          }
        }}
        onTransformEnd={() => {
          const node = elementRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);
          onTransformEnd({
            ...props,
            rotation: node.rotation(),
            x: node.x(),
            y: node.y(),
            fontSize: node.fontSize() * scaleX,
            scaleX: 1,
            scaleY: 1,
          });
          elementRef.current?.show();
          node.getLayer()?.batchDraw();
        }}
      />
      {isSelected && (
        <Portal selector=".top-layer" enabled={isSelected}>
          <Transformer
            ref={transformerRef}
            borderStroke={"#129FEE"}
            borderStrokeWidth={2}
            anchorStroke={"#129FEE"}
            anchorStrokeWidth={1.5}
            anchorSize={9}
            rotateAnchorOffset={30}
            rotateEnabled={!lock}
            rotationSnaps={Array(4)
              .fill(0)
              .map((_, i) => i * 90)}
            rotationSnapTolerance={10}
            enabledAnchors={
              !lock ? ["top-left", "top-right", "middle-right", "bottom-right", "bottom-left", "middle-left"] : []
            }
            boundBoxFunc={(_oldBox, newBox) => ({
              ...newBox,
              width: Math.max(30, newBox.width),
            })}
          />
        </Portal>
      )}
      <Html divProps={divProps}>
        <textarea
          ref={textareaRef}
          value={textareaValue}
          style={textareaProps.style}
          onChange={onChangeHandler}
          onBlur={() => {
            if (originValue !== textareaValue && elementRef.current) {
              onTransform({
                id,
                text: textareaValue,
              } as Partial<TextElement>);
            }
            onBlurHandler();
          }}
          onKeyDown={({ key, shiftKey }) => {
            if(!elementRef.current) return;
            if ((key === "Enter" && !shiftKey) || key === "Escape") {
              if (originValue !== textareaValue) {
                onTransform({
                  id,
                  text: textareaValue,
                } as Partial<TextElement>);
              }
              onBlurHandler();
              elementRef.current.show();
            }
          }}
        />
      </Html>
    </>
  );
};

export { EditableText };
