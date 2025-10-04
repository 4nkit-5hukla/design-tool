import { FC, Fragment, useRef } from "react";
import { Ellipse, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { useTransformer } from "Hooks";

interface TransformableCircleProps {
  onDragStart: (shape: Konva.ShapeConfig) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransform: (e: Record<string, number>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected: boolean;
  radiusX: number;
  radiusY: number;
  [key: string]: unknown;
}

const TransformableCircle: FC<TransformableCircleProps> = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  ...props
}) => {
  const circleRef = useRef<Konva.Ellipse | any>();
  const transformerRef = useRef<Konva.Transformer | any>();
  const snaps = Array(24)
    .fill(0)
    .map((_, i) => i * 15);

  useTransformer({
    isSelected,
    ref: circleRef,
    transformer: transformerRef,
  });

  return (
    <Fragment>
      <Ellipse
        ref={circleRef}
        {...props}
        offsetX={-props.radiusX}
        offsetY={-props.radiusY}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={(e) => onDragEnd(e)}
        onTransformEnd={(e) => {
          const node = circleRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          onTransform({
            ...props,
            rotation: node.rotation(),
            x: node.x(),
            y: node.y(),
            radiusX: (node.width() * scaleX) / 2,
            radiusY: (node.height() * scaleY) / 2,
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
            rotationSnaps={snaps}
            rotationSnapTolerance={15 / 2}
            // rotateEnabled={false}
            // enabledAnchors={[
            //   "top-left",
            //   "top-center",
            //   "top-right",
            //   "middle-right",
            //   "bottom-right",
            //   "bottom-center",
            //   "bottom-left",
            //   "middle-left",
            // ]}
          />
        </Portal>
      )}
    </Fragment>
  );
};

export { TransformableCircle };
