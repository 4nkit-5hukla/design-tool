import {
  // useEffect, useState,
  useRef,
} from "react";
import { Group, Image, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";

import { useElementCache, useTransformer } from "Hooks";

export const TransformableImage = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  isCropping,
  maxWidth,
  src,
  rgb,
  filters,
  draggable,
  lock,
  canvasHeight,
  canvasWidth,
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
}) => {
  const igRef = useRef<Konva.Group | any>();
  const imageRef = useRef<Konva.Image | any>();
  const transformerRef = useRef<Konva.Transformer | any>();

  useTransformer({
    isSelected,
    ref: igRef,
    transformer: transformerRef,
  });

  useElementCache({
    ref: igRef,
    deps: [isSelected, props],
  });

  useElementCache({
    ref: imageRef,
    deps: [isSelected, props],
  });

  console.log(isCropping);

  return (
    <>
      <Image
        {...props}
        id={`darkImg-${props.id}`}
        image={src}
        visible={isCropping}
        opacity={0.5}
        fill="black"
        strokeWidth={1}
        dash={[3, 3]}
        listening={false}
      />
      <Group
        id={`${props.id}-ig`}
        ref={igRef}
        // clip={{
        //   x: props.x,
        //   y: props.y,
        //   width: imgRect ? imgRect.width() : props.width,
        //   height: imgRect ? imgRect.height() : props.height,
        // }}
        // x={imgRect ? imgRect.x() - imgGroup.clipX() * imgGroup.scaleX() : 100}
        // y={imgRect ? imgRect.y() - imgGroup.clipY() * imgGroup.scaleY() : 100}
        height={props.height}
        width={props.width}
        draggable={!lock ? draggable : false}
      >
        <Image
          {...props}
          image={src}
          ref={imageRef}
          // draggable={!lock ? draggable : false}
          // offsetX={
          //   props.x < width / 2
          //     ? 0
          //     : props.x > canvasWidth - width / 2
          //     ? width
          //     : width / 2
          // }
          // offsetY={
          //   props.y < height / 2
          //     ? 0
          //     : props.y > canvasHeight - height / 2
          //     ? height
          //     : height / 2
          // }
          filters={[...filters, ...(rgb ? [Konva.Filters.RGB] : [])]}
          onClick={onClick}
          onDragStart={onDragStart}
          onDragEnd={(e) => onDragEnd(e)}
          onTransformEnd={() => {
            const node = imageRef.current;
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
            rotateAnchorOffset={30}
            keepRatio={true}
            flipEnabled={true}
            rotateEnabled={!lock}
            enabledAnchors={
              !lock
                ? ["top-left", "top-right", "bottom-right", "bottom-left"]
                : []
            }
            boundBoxFunc={(oldBox, newBox) =>
              newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
            }
          />
        </Portal>
      )}
    </>
  );
};
