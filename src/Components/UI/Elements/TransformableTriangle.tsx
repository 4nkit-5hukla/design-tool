import { FC, Fragment, useRef, RefObject } from "react";
import { Path, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { useTransformer } from "Hooks";
import { PathElement } from "Interfaces/Elements";

interface TransformableTriangleProps extends Omit<PathElement, "type"> {
  onDragStart: (shape: PathElement) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransform: (config: Partial<PathElement>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected: boolean;
  d: string;
  draggable?: boolean;
  lock?: boolean;
}

const TransformableTriangle: FC<TransformableTriangleProps> = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  ...props
}) => {
  const triangleRef = useRef<Konva.Path>(null);
  const transformerRef = useRef<Konva.Transformer>(null) as RefObject<Konva.Transformer>;
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
        onDragStart={() => onDragStart({ ...props, type: "path", data: props.d } as PathElement)}
        onDragEnd={(e) => onDragEnd(e)}
        onTransformEnd={() => {
          const node = triangleRef.current;
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
