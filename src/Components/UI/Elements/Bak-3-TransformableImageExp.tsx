import {
  // useEffect, useState,
  useRef,
} from "react";
import { Image, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";

import { useElementCache, useTransformer } from "Hooks";

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
  const imageRef = useRef<Konva.Image | any>();
  const transformerRef = useRef<Konva.Transformer | any>();

  useTransformer({
    isSelected,
    ref: imageRef,
    transformer: transformerRef,
  });

  useElementCache({
    ref: imageRef,
    deps: [isSelected, props],
  });

  return (
    <>
      <Image
        {...props}
        image={src}
        ref={imageRef}
        draggable={!lock ? draggable : false}
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
