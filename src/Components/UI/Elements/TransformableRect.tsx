import { FC, Fragment, useRef, RefObject } from "react";
import { Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { useTransformer } from "Hooks";
import { RectangleElement } from "Interfaces/Elements";

interface TransformableRectProps extends Omit<RectangleElement, "type"> {
  onDragStart: (shape: RectangleElement) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransform: (config: Partial<RectangleElement>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected: boolean;
  draggable?: boolean;
  lock?: boolean;
}

const TransformableRect: FC<TransformableRectProps> = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  ...props
}) => {
  const rectRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null) as RefObject<Konva.Transformer>;

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
        onDragStart={() => onDragStart(props as RectangleElement)}
        onDragEnd={(e) => onDragEnd(e)}
        onTransformEnd={() => {
          const node = rectRef.current;
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
