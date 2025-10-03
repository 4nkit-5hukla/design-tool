/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useRef } from "react";
import { Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";

import { useTransformer } from "Hooks";

const TransformableRect = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  ...props
}: {
  onDragStart: (shape: Konva.ShapeConfig) => void;
  onDragEnd: (e: any) => void;
  onTransform: (e: any) => void;
  onClick: (e: any) => void;
  isSelected: boolean;
  [key: string]: any;
}) => {
  const rectRef = useRef<Konva.Rect | any>();
  const transformerRef = useRef<Konva.Transformer | any>();

  useTransformer({
    isSelected,
    ref: rectRef,
    transformer: transformerRef,
  });

  return (
    <Fragment>
      <Rect
        onClick={onClick}
        ref={rectRef}
        {...props}
        onDragStart={onDragStart}
        onDragEnd={(e) => onDragEnd(e)}
        onTransformEnd={() => {
          const node = rectRef.current;
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
            anchorCornerRadius={0}
            rotateAnchorOffset={30}
            // keepRatio={true}
            flipEnabled={true}
            rotateEnabled={true}
            enabledAnchors={[
              "top-left",
              "top-center",
              "top-right",
              "middle-right",
              "bottom-right",
              "bottom-center",
              "bottom-left",
              "middle-left",
            ]}
          />
        </Portal>
      )}
    </Fragment>
  );
};

export { TransformableRect };
