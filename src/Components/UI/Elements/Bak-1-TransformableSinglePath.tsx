/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useRef, useState } from "react";
import { Group, Image, Path, Shape, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import useImage from "use-image";

import { useTransformer } from "Hooks";

const TransformableSinglePath = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  stroke,
  strokeWidth,
  strokeType,
  fill,
  d,
  ...props
}: {
  onDragStart: (shape: Konva.ShapeConfig) => void;
  onDragEnd: (e: any) => void;
  onTransform: (e: any) => void;
  onClick: (e: any) => void;
  isSelected: boolean;
  [key: string]: any;
}) => {
  const rootGroupRef = useRef<Konva.Group | any>();
  const pathRef = useRef<Konva.Path | any>();
  const transformerRef = useRef<Konva.Transformer | any>();
  const [fillImage, fillImageStatus] = useImage(
    "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=660"
  );
  const [fillImageAttr, setFillImageAttr] = useState({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    patternOffsetX: 0,
    patternOffsetY: 0,
  });

  useEffect(() => {
    if (fillImage && fillImageStatus === "loaded") {
      setFillImageAttr({
        ...fillImageAttr,
        x: props.x,
        y: props.y,
        height: fillImage.height,
        width: fillImage.width,
      });
    }
  }, [fillImage, fillImageStatus]);

  useTransformer({
    isSelected,
    ref: rootGroupRef,
    transformer: transformerRef,
  });

  return (
    <Fragment>
      {/* <Image
        x={fillImageAttr.x}
        y={fillImageAttr.y}
        image={fillImage}
        scaleX={props.scaleX}
        scaleY={props.scaleY}
        offsetX={props.width}
        offsetY={props.height}
        opacity={0.5}
        fill="#000000"
        stroke="red"
        strokeWidth={2}
        dash={[0]}
        // draggable
        // onDragStart={onDragStart}
        // // onDragEnd={(e) => onDragEnd(e)}
        // onDragMove={(e) => {
        //   onDragMove(e);
        // }}
        // onTransform={() => {
        //   const node = imageRef.current;
        //   if (node) {
        //     const scaleX = node.scaleX();
        //     const scaleY = node.scaleY();
        //     node.scaleX(1);
        //     node.scaleY(1);
        //     onTransform({
        //       ...props,
        //       rotation: node.rotation(),
        //       x: node.x(),
        //       y: node.y(),
        //       width: node.width() * scaleX,
        //       height: node.height() * scaleY,
        //     });
        //   }
        // }}
      /> */}
      <Group
        ref={rootGroupRef}
        {...props}
        x={props.x}
        y={props.y}
        scaleX={Math.abs(props.scaleX)}
        scaleY={Math.abs(props.scaleY)}
        height={props.height}
        width={props.width}
        offsetX={props.width / 2}
        offsetY={props.height / 2}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={(e) => onDragEnd(e)}
        clipFunc={(ctx: any) => {
          // console.log(ctx);
          var p = new Path2D(d);
          // ctx.stroke(p);
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.fill(p);
          // ctx.clip(p);
          // ctx.arc(-30, 0, 5, 0, Math.PI * 2, false);
          // ctx.arc(20, 0, 6, 0, Math.PI * 2, false);
        }}
        // onDragMove={(e) => {
        //   const node = e.target;
        //   console.log(node.x() - props.width, node.y() - props.height);
        //   setFillImageAttr({
        //     ...fillImageAttr,
        //     patternOffsetX: node.x() - props.width,
        //     patternOffsetY: node.y() - props.height,
        //   });
        // }}
      >
        <Path
          ref={pathRef}
          fill={fill}
          scaleX={props.scaleX}
          scaleY={props.scaleY}
          offsetX={props.width / 2}
          offsetY={props.height / 2}
          data={d}
          stroke={stroke}
          strokeEnabled={strokeWidth > 0}
          strokeWidth={strokeWidth}
          // fillPatternImage={fillImage}
          // fillPatternOffset={{
          //   x: fillImageAttr.patternOffsetX,
          //   y: fillImageAttr.patternOffsetY,
          // }}
          // // fillPatternScale={{ x: 1, y: 1 }}
          // fillPatternRepeat="no-repeat"
          dash={
            strokeType === "long-dash"
              ? [(strokeWidth / 2) * 4, (strokeWidth / 2) * 2]
              : strokeType === "dash"
              ? [(strokeWidth / 2) * 1.5, (strokeWidth / 2) * 1.5]
              : [0]
          }
          hitStrokeWidth={8}
          // lineJoin="miter|round|bevel"
          // lineCap="square"
          fillAfterStrokeEnabled={true}
          // strokeScaleEnabled={false}
          onTransformEnd={(e) => {
            const node = rootGroupRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onTransform({
              ...props,
              rotation: node.rotation(),
              x: node.x(),
              y: node.y(),
              scaleX,
              scaleY,
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }}
        />
      </Group>
      {isSelected && (
        <Portal selector=".top-layer" enabled={isSelected}>
          <Transformer
            ref={transformerRef}
            borderStroke={"#129FEE"}
            borderStrokeWidth={2}
            anchorStroke={"#129FEE"}
            anchorStrokeWidth={1.5}
            anchorSize={9}
            anchorCornerRadius={0}
            rotateAnchorOffset={30}
            rotationSnaps={Array(24)
              .fill(0)
              .map((_, i) => i * 15)}
            rotationSnapTolerance={15 / 2}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-right",
              "bottom-left",
            ]}
          />
        </Portal>
      )}
    </Fragment>
  );
};

export { TransformableSinglePath };
