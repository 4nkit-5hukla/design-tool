import { FC, Fragment, useRef } from "react";
import { Path, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { useTransformer } from "Hooks";

interface TransformableTriangleProps {
  onDragStart: (shape: Konva.ShapeConfig) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransform: (e: Record<string, unknown>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected: boolean;
  [key: string]: unknown;
}

const TransformableTriangle: FC<TransformableTriangleProps> = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  ...props
}) => {
  const triangleRef = useRef<Konva.Path | any>();
  const transformerRef = useRef<Konva.Transformer | any>();
  const snaps = Array(12)
    .fill(0)
    .map((_, i) => i * 30);

  useTransformer({
    isSelected,
    ref: triangleRef,
    transformer: transformerRef,
  });

  return (
    <Fragment>
      <Path
        ref={triangleRef}
        {...props}
        fill={props.fill}
        x={props.x}
        y={props.y}
        scaleX={props.scaleX}
        scaleY={props.scaleY}
        height={props.height}
        width={props.width}
        data={props.d}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={(e) => onDragEnd(e)}
        onTransformEnd={(e) => {
          const node = triangleRef.current;
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
            rotationSnapTolerance={30 / 2}
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

export { TransformableTriangle };
