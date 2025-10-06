import { FC, Fragment, useEffect, useRef, useState, RefObject } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Context as SceneContext } from "konva/lib/Context";

import {
  // useElementCache,
  useTransformer,
} from "Hooks";
import { ImageElement } from "Interfaces/Elements";

interface TransformableImageProps {
  onDragStart: (element: ImageElement) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransform: (config: Partial<ImageElement>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected: boolean;
  src: HTMLImageElement;
  maxWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  stage: Konva.Stage;
  rgb?: boolean;
  filters?: Array<(imageData: ImageData) => void>;
  draggable?: boolean;
  lock?: boolean;
  isCropping?: boolean;
  isCropped?: boolean;
  id: string;
  name?: string;
  strokeEnabled?: boolean;
  stroke?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation?: number;
  type: "image";
  blue?: number;
  blurRadius?: number;
  brightness?: number;
  contrast?: number;
  enhance?: number;
  green?: number;
  red?: number;
  saturation?: number;
}

export const TransformableImage: FC<TransformableImageProps> = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  maxWidth,
  src,
  rgb = false,
  filters = [],
  draggable = true,
  lock = false,
  isCropping = false,
  isCropped = false,
  id,
  name,
  strokeEnabled = false,
  stroke,
  strokeWidth,
  shadowColor,
  shadowBlur,
  shadowOffsetX,
  shadowOffsetY,
  shadowOpacity,
  shadowEnabled = false,
  canvasWidth,
  canvasHeight,
  stage,
  ...props
}) => {
  const rootGroupRef = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);
  const rectRef = useRef<Konva.Rect>(null);

  const initialRectWidth = 250;
  const initialRectHeight = 200;
  const [
    rectWidth,
    // setRectWidth
  ] = useState(initialRectWidth);
  const [
    rectHeight,
    // setRectHeight
  ] = useState(initialRectHeight);
  const [rectX, setRectX] = useState(canvasWidth - props.x);
  const [rectY, setRectY] = useState(canvasHeight - props.y);

  const rootTransformerRef = useRef<Konva.Transformer>(null) as RefObject<Konva.Transformer>;
  const rectTransformerRef = useRef<Konva.Transformer>(null) as RefObject<Konva.Transformer>;

  useTransformer({
    isSelected,
    ref: (isCropped ? rectRef : rootGroupRef) as RefObject<Konva.Group>,
    transformer: rootTransformerRef,
  });

  useTransformer({
    isSelected: isCropping,
    ref: rectRef,
    transformer: rectTransformerRef,
  });

  useEffect(() => {
    setRectX(canvasWidth - props.x);
    setRectY(canvasHeight - props.y);
  }, [canvasWidth, canvasHeight, props.x, props.y]);

  useEffect(() => {
    if (src) {
      // You may need to reapply cache on some props changes like shadow, stroke, etc.
    }
  }, [
    src,
  ]);

  useEffect(() => {
    if (isSelected && rootTransformerRef.current) {
      const stage = rootTransformerRef.current.getStage();
      const rotater = rootTransformerRef.current.findOne(".rotater");
      if (rotater && stage)
        rotater.on("mouseenter", () => {
          stage.content.style.cursor = `url("data:image/svg+xml,%3Csvg%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M11.8597%2017.3593L11.652%2017.395V17.6057V19.5921L5.12661%2016.2681L11.652%2012.9441V14.7281V15.0506L11.9643%2014.9702C14.9074%2014.2131%2017.0994%2011.7875%2017.0994%208.88374C17.0994%205.36349%2013.8862%202.54885%2010%202.54885C6.11384%202.54885%202.9006%205.36349%202.9006%208.88374C2.9006%209.73835%203.08658%2010.5636%203.45294%2011.3393L1.06179%2012.3371C0.52252%2011.2457%200.25%2010.0857%200.25%208.88383C0.250101%204.15038%204.59557%200.25%2010.0001%200.25C15.4046%200.25%2019.75%204.15038%2019.75%208.88383C19.75%2013.0601%2016.3711%2016.5844%2011.8597%2017.3593Z%27%20fill%3D%27%23fff%27%20stroke%3D%27%23000%27%20stroke-width%3D%270.5%27%2F%3E%3C%2Fsvg%3E") 10 10, auto`;
        });
    }
  }, [isSelected, rootTransformerRef]);

  return (
    <Fragment>
      <Image
        {...props}
        id={`darkImg-${id}`}
        image={src}
        visible={isCropping}
        opacity={0.5}
        offsetX={props.width}
        offsetY={props.height}
        fill="#000000"
        strokeWidth={1}
        dash={[3, 3]}
      />
      <Group
        ref={rootGroupRef}
        {...props}
        id={`rootGroup-${id}`}
        name={name}
        x={props.x}
        y={props.y}
        scaleX={Math.abs(props.scaleX)}
        scaleY={Math.abs(props.scaleY)}
        height={props.height}
        width={props.width}
        offsetX={props.width / 2}
        offsetY={props.height / 2}
        onClick={onClick}
        {...(isCropping || isCropped
          ? {
              clipFunc: (ctx: SceneContext) => {
                const fakeShape = rectRef.current;
                if (!fakeShape) return;
                ctx.save();
                ctx.translate(fakeShape.x() - canvasWidth / 2, fakeShape.y() - canvasHeight / 2);
                const angleInRadians = (fakeShape.rotation() * Math.PI) / 180;
                ctx.rotate(angleInRadians);
                ctx.rect(0, 0, fakeShape.width() * fakeShape.scaleX(), fakeShape.height() * fakeShape.scaleY());
                ctx.restore();
              },
            }
          : {})}
        draggable={!lock ? draggable : false}
        onDragStart={() => onDragStart(props as ImageElement)}
        onDragEnd={(e) => onDragEnd(e)}
        onTransformEnd={() => {
          const node = rootGroupRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onTransform({
              ...props,
              rotation: node.rotation(),
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }
        }}
      >
        <Image
          id={id}
          ref={imageRef}
          image={src}
          scaleX={props.scaleX}
          scaleY={props.scaleY}
          offsetX={props.width / 2}
          offsetY={props.height / 2}
          height={props.height}
          width={props.width}
          shadowColor={shadowColor}
          shadowBlur={shadowBlur}
          shadowOffsetX={shadowOffsetX}
          shadowOffsetY={shadowOffsetY}
          shadowOpacity={shadowOpacity}
          shadowEnabled={shadowEnabled}
          filters={[...filters, ...(rgb ? [Konva.Filters.RGB] : [])]}
          blue={props.blue}
          blurRadius={props.blurRadius}
          brightness={props.brightness}
          contrast={props.contrast}
          enhance={props.enhance}
          green={props.green}
          red={props.red}
          rgb={rgb}
          saturation={props.saturation}
          strokeEnabled={strokeEnabled}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeScaleEnabled={false}
        />
      </Group>
      {isSelected && (
        <Portal selector=".top-layer" enabled={isSelected}>
          <Transformer
            ref={rootTransformerRef}
            borderStroke={"#129FEE"}
            borderStrokeWidth={2}
            anchorStroke={"#129FEE"}
            anchorStrokeWidth={1.5}
            anchorSize={9}
            rotateAnchorOffset={30}
            keepRatio={true}
            flipEnabled={true}
            rotateEnabled={!lock && !isCropping && !isCropped}
            rotationSnaps={Array(4)
              .fill(0)
              .map((_, i) => i * 90)}
            rotationSnapTolerance={10}
            enabledAnchors={
              !lock && !isCropping && !isCropped ? ["top-left", "top-right", "bottom-right", "bottom-left"] : []
            }
          />
        </Portal>
      )}
      <Rect
        ref={rectRef}
        x={rectX}
        y={rectY}
        visible={isCropping || isCropped}
        width={rectWidth}
        height={rectHeight}
        onClick={onClick}
        draggable={!lock && !isCropped}
        onDragMove={({ target: node }) => {
          setRectX(node.x());
          setRectY(node.y());
        }}
        onTransform={() => {}}
      />
      {isCropping && (
        <Portal selector=".top-layer" enabled={isCropping}>
          <Transformer
            ref={rectTransformerRef}
            borderStroke={"#129FEE"}
            borderStrokeWidth={2}
            anchorFill={"#129FEE"}
            anchorStroke={"#129FEE"}
            anchorStrokeWidth={1.5}
            anchorSize={9}
            anchorCornerRadius={0}
            keepRatio={false}
            flipEnabled={false}
            rotateEnabled={false}
            enabledAnchors={
              !lock
                ? [
                    "top-left",
                    "top-center",
                    "top-right",
                    "middle-right",
                    "bottom-right",
                    "bottom-center",
                    "bottom-left",
                    "middle-left",
                  ]
                : []
            }
          />
        </Portal>
      )}
    </Fragment>
  );
};
