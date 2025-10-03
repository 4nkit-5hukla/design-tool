/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useRef, useState } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";

import {
  // useElementCache,
  useTransformer,
} from "Hooks";

export const TransformableImage = ({
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
  // clipData,
  canvasWidth,
  canvasHeight,
  stage,
  ...props
}: {
  onDragStart: (element: Konva.ShapeConfig) => void;
  onDragEnd: (e: any) => void;
  onTransform: (e: any) => void;
  onClick: (e: any) => void;
  isSelected: boolean;
  src: Konva.ImageConfig["image"];
  maxWidth: number;
  [key: string]: any;
  canvasWidth: number;
  canvasHeight: number;
  stage: any;
}) => {
  const rootGroupRef = useRef<Konva.Group | any>();
  const imageRef = useRef<Konva.Image | any>();
  const rectRef = useRef<Konva.Rect | any>();

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

  const rootTransformerRef = useRef<Konva.Transformer | any>();
  const rectTransformerRef = useRef<Konva.Transformer | any>();

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
    const mainImg = stage.findOne((node: any) => node.id() === id);
    if (src) {
      // mainImg.clearCache();
      // mainImg.cache();
      // mainImg.drawHitFromCache();
      mainImg.getLayer().batchDraw();
    }
  }, [
    src,
    // props.id, stage
  ]);

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
                ctx.translate(
                  fakeShape.x() - canvasWidth / 2,
                  fakeShape.y() - canvasHeight / 2
                );
                ctx.rotate((Konva as any).getAngle(fakeShape.rotation()));
                ctx.rect(
                  0,
                  0,
                  fakeShape.width() * fakeShape.scaleX(),
                  fakeShape.height() * fakeShape.scaleY()
                );
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
            shadowBlur: props.shadowBlur,
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
            enabledAnchors={
              !lock && !isCropping && !isCropped
                ? ["top-left", "top-right", "bottom-right", "bottom-left"]
                : []
            }
            boundBoxFunc={(oldBox, newBox) =>
              newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
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
            boundBoxFunc={(oldBox, newBox) =>
              newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
            }
          />
        </Portal>
      )}
    </Fragment>
  );
};
