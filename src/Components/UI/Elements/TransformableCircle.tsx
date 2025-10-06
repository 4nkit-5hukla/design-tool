import { FC, Fragment, useRef, RefObject } from "react";
import { Ellipse, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { useTransformer } from "Hooks";
import { CircleElement } from "Interfaces/Elements";

interface TransformableCircleProps extends Omit<CircleElement, "type"> {
  onDragStart: (shape: CircleElement) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransform: (config: Partial<CircleElement>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected: boolean;
  draggable?: boolean;
  lock?: boolean;
}

const TransformableCircle: FC<TransformableCircleProps> = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  ...props
}) => {
  const circleRef = useRef<Konva.Ellipse>(null);
  const transformerRef = useRef<Konva.Transformer>(null) as RefObject<Konva.Transformer>;
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
        onDragStart={() => onDragStart(props as CircleElement)}
        onDragEnd={(e) => onDragEnd(e)}
        onTransformEnd={() => {
          const node = circleRef.current;
          if (!node) return;

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
          />
        </Portal>
      )}
    </Fragment>
  );
};

export { TransformableCircle };
