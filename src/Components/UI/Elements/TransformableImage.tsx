import { FC, Fragment, useEffect, useRef, useState } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import {
  // useElementCache,
  useTransformer,
} from "Hooks";

interface TransformableImageProps {
  onDragStart: (element: Konva.ShapeConfig) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransform: (e: Record<string, unknown>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected: boolean;
  src: Konva.ImageConfig["image"];
  maxWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  stage: Konva.Stage;
  [key: string]: unknown;
}

export const TransformableImage: FC<TransformableImageProps> = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  maxWidth,
  src,
  rgb,
  filters,
  draggable,
  lock,
  isCropping,
  isCropped,
  id,
  name,
  strokeEnabled,
  stroke,
  strokeWidth,
  shadowColor,
  shadowBlur,
  shadowOffsetX,
  shadowOffsetY,
  shadowOpacity,
  shadowEnabled,
  canvasWidth,
  canvasHeight,
  stage,
  ...props
}) => {
  const rootGroupRef = useRef<Konva.Group | null>(null);
  const imageRef = useRef<Konva.Image | null>(null);
  const rectRef = useRef<Konva.Rect | null>(null);

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

  const rootTransformerRef = useRef<Konva.Transformer | null>(null);
  const rectTransformerRef = useRef<Konva.Transformer | null>(null);

  useTransformer({
    isSelected,
    ref: isCropped ? rectRef : rootGroupRef,
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
    // const mainImg = stage.findOne((node: any) => node.id() === id);
    if (src) {
      // mainImg.clearCache();
      // mainImg.drawHitFromCache();
      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      /* mainImg.cache(); */
      // since this update is not handled by "react-konva" and we are using Konva methods directly
      // we have to redraw layer manually
      /* mainImg.getLayer().batchDraw(); */
    }
  }, [
    src,
    // props.id, stage
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

  // useElementCache({
  //   ref: rootGroupRef,
  //   deps: [isSelected, props],
  // });

  // useElementCache({
  //   ref: imageRef,
  //   deps: [isSelected, props],
  // });

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
              clipFunc: (ctx: any) => {
                const fakeShape = rectRef.current;
                ctx.save();
                ctx.translate(fakeShape.x() - canvasWidth / 2, fakeShape.y() - canvasHeight / 2);
                ctx.rotate((Konva as any).getAngle(fakeShape.rotation()));
                ctx.rect(0, 0, fakeShape.width() * fakeShape.scaleX(), fakeShape.height() * fakeShape.scaleY());
                ctx.restore();
              },
            }
          : {})}
        draggable={!lock ? draggable : false}
        onDragStart={onDragStart}
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
          {...{
            blue: props.blue,
            blurRadius: props.blurRadius,
            brightness: props.brightness,
            contrast: props.contrast,
            enhance: props.enhance,
            green: props.green,
            red: props.red,
            rgb: props.rgb,
            saturation: props.saturation,
            strokeEnabled,
            stroke,
            strokeWidth,
            strokeScaleEnabled: false,
          }}
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
        onTransform={(e) => {}}
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
