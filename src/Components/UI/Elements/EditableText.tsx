/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useRef, useEffect, useState } from "react";
import { Text, Transformer } from "react-konva";
import { Html, Portal } from "react-konva-utils";
import Konva from "konva";

import { useTransformer } from "Hooks";
import { useElementsContext } from "Contexts/Elements";

const EditableText = ({
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
  lock,
  useList,
  listType,
  canvasHeight,
  canvasWidth,
  name,
  ...props
}: {
  onDragEnd: (e: any) => void;
  onTransform: (e: any) => void;
  onClick: (e: any) => void;
  isSelected: boolean;
  stage: Konva.Stage;
  id: string | any;
  text: string;
  [key: string]: any;
  canvasWidth: number;
  canvasHeight: number;
}) => {
  const { focused, setFocused, unFocus } = useElementsContext();

  const elementRef = useRef<Konva.Text | any>();
  const textareaRef = useRef<HTMLTextAreaElement | any>();
  const transformerRef = useRef<Konva.Transformer | any>();
  // const [height, setHeight] = useState<number>(0);
  // const [width, setWidth] = useState<number>(0);
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
  const [divProps, setDivProps] = useState<any>({
    style: {
      display: "none",
      position: "absolute",
    },
  });

  const [textareaProps, setTextareaProps] = useState<any>({
    style: {
      display: "block",
      border: "none",
      padding: "0px",
      margin: "0px",
      overflow: "hidden",
      background: "none",
      outline: "none",
      resize: "none",
      height: "",
      fontSize: "",
      lineHeight: "",
      fontFamily: "",
      textAlign: "",
      color: "",
      transform: "",
      transformOrigin: "left top",
      width: "100%",
      wordBreak: "keep-all",
    },
  });

  const [originValue, setOriginValue] = useState<string>(text);
  const [textareaValue, setTextareaValue] = useState<string>(originValue);

  const getTextareaWidth = (width: any) => {
    let newWidth = width;
    if (!newWidth) {
      newWidth =
        elementRef.current.text().length * elementRef.current.fontSize();
    }

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isSafari || isFirefox) {
      newWidth = Math.ceil(newWidth);
    }

    const isEdge = /Edge/.test(navigator.userAgent);
    if (isEdge) {
      newWidth += 1;
    }

    return newWidth;
  };

  useTransformer({
    isSelected,
    ref: elementRef,
    transformer: transformerRef,
  });

  useEffect(() => {
    if (!created) {
      const element = elementRef.current;
      element.width(element.width() * 1.05);
      setCreated(true);
      return;
    }

    if (focused === null) {
      if (originValue !== textareaValue) {
        onTransform({
          id,
          text: textareaValue,
          width: getTextareaWidth(elementRef.current.width()),
        });
      }
      setDivProps({
        style: {
          ...divProps.style,
          display: "none",
        },
      });

      elementRef.current.show();
      // if (isSelected) {
      //   transformerRef.current.show();
      // }
    }
  }, [focused]);

  const handleTextDblClick = (e: any) => {
    toggleEditText(true);
    elementRef.current.hide();
    // transformerRef.current.hide();

    const textPosition = elementRef.current.absolutePosition();

    const areaPosition = {
      x: stage.offsetX() + textPosition.x,
      y: stage.offsetY() + textPosition.y,
    };

    const updatedDivProps = {
      ...divProps,
    };

    setOriginValue(textareaValue);

    const updatedTextareaProps = {
      ...textareaProps,
      style: {
        ...textareaProps.style,
      },
    };

    const getTransform = () => {
      const rotation = elementRef.current.rotation();

      let transform = "";
      if (rotation) {
        transform += `rotateZ(${rotation}deg)`;
      }

      let px = 0;

      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        px += 2 + Math.round(elementRef.current.fontSize() / 20);
      }

      transform += `translateY(-${px}px)`;

      return transform;
    };

    updatedDivProps.style = {
      ...divProps.style,
      width: `${
        elementRef.current.width() - elementRef.current.padding() * 2
      }px`,
      height: `${
        elementRef.current.height() - elementRef.current.padding() * 2 + 5
      }px`,
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
      textAlign: elementRef.current.align(),
      color: elementRef.current.fill(),
      transform: getTransform(),
      height: updatedDivProps.style.height,
      ...(elementRef.current.strokeEnabled()
        ? {
            WebkitTextFillColor: elementRef.current.fill(),
            WebkitTextStrokeColor: elementRef.current.stroke(),
            WebkitTextStrokeWidth: `${elementRef.current.strokeWidth()}px`,
          }
        : {}),
      ...(elementRef.current.fontStyle() === "bold"
        ? {
            fontWeight: "bold",
          }
        : {}),
      ...(elementRef.current.fontStyle() === "italic"
        ? { fontStyle: "italic" }
        : {}),
      ...(elementRef.current.textDecoration() === "underline"
        ? { textDecoration: "underline", textDecorationThickness: "from-font" }
        : {}),
    };

    setDivProps(updatedDivProps);
    setTextareaProps(updatedTextareaProps);
    setTextareaValue(elementRef.current.text());

    textareaRef.current.focus();
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
    removeTextarea();
    elementRef.current.show();
    unFocus();
    toggleEditText(false);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    textareaRef.current.style.height = "auto";

    textareaRef.current.style.height = `${
      textareaRef.current.scrollHeight + elementRef.current.fontSize()
    }px`;

    setDivProps({
      style: {
        ...divProps.style,
        height: `${
          textareaRef.current.scrollHeight + elementRef.current.fontSize()
        }px`,
      },
    });

    setTextareaValue(
      useList ? applyList(e.target.value, listType) : e.target.value
    );
  };

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    setDivProps({
      style: {
        ...divProps.style,
        height: `${
          textareaRef.current.scrollHeight + elementRef.current.fontSize()
        }px`,
      },
    });
  }, [textareaValue]);

  useEffect(() => {
    if (transformerRef.current)
      transformerRef.current.findOne(".rotater").on("mouseenter", () => {
        transformerRef.current.getStage().content.style.cursor = `url("data:image/svg+xml,%3Csvg%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M11.8597%2017.3593L11.652%2017.395V17.6057V19.5921L5.12661%2016.2681L11.652%2012.9441V14.7281V15.0506L11.9643%2014.9702C14.9074%2014.2131%2017.0994%2011.7875%2017.0994%208.88374C17.0994%205.36349%2013.8862%202.54885%2010%202.54885C6.11384%202.54885%202.9006%205.36349%202.9006%208.88374C2.9006%209.73835%203.08658%2010.5636%203.45294%2011.3393L1.06179%2012.3371C0.52252%2011.2457%200.25%2010.0857%200.25%208.88383C0.250101%204.15038%204.59557%200.25%2010.0001%200.25C15.4046%200.25%2019.75%204.15038%2019.75%208.88383C19.75%2013.0601%2016.3711%2016.5844%2011.8597%2017.3593Z%27%20fill%3D%27%23fff%27%20stroke%3D%27%23000%27%20stroke-width%3D%270.5%27%2F%3E%3C%2Fsvg%3E") 10 10, auto`;
      });
  }, [transformerRef]);

  return (
    <Fragment>
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
        onTransform={(e) => {
          const node = elementRef.current;
          if (
            Math.ceil(node.height() * node.scaleY()) ===
            Math.ceil(node.height())
          ) {
            node.setAttrs({
              scaleX: 1,
              // scaleY: node.scaleY(),
              width: node.width() * node.scaleX(),
              height: "auto",
              // fontSize: Math.floor(node.fontSize() * node.scaleY()),
            });
            onTransform({
              width: node.width() * node.scaleX(),
            });
          }
        }}
        onTransformEnd={(e) => {
          const node = elementRef.current;
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);
          onTransformEnd({
            ...props,
            rotation: node.rotation(),
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            fontSize: node.fontSize() * scaleX, // relation with props.lineHeight
            scaleX: 1,
            scaleY: 1,
          });
          elementRef.current.show();
          node.getLayer().batchDraw();
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
            // keepRatio={false}
            enabledAnchors={
              !lock
                ? [
                    "top-left",
                    "top-right",
                    "middle-right",
                    "bottom-right",
                    "bottom-left",
                    "middle-left",
                  ]
                : []
            }
            boundBoxFunc={(oldBox, newBox) => ({
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
            if (originValue !== textareaValue) {
              onTransform({
                id,
                text: textareaValue,
                width: getTextareaWidth(elementRef.current.width()),
              });
            }
            onBlurHandler();
          }}
          onKeyDown={({ key, shiftKey }) => {
            if ((key === "Enter" && !shiftKey) || key === "Escape") {
              // enter key and no shift
              if (originValue !== textareaValue) {
                onTransform({
                  id,
                  text: textareaValue,
                  width: getTextareaWidth(elementRef.current.width()),
                });
              }
              onBlurHandler();
              elementRef.current.show();
            }
          }}
        />
      </Html>
    </Fragment>
  );
};

export { EditableText };
