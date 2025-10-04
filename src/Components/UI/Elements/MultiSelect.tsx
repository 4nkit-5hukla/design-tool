import { useRef } from "react";
import { Rect, Transformer } from "react-konva";
import Konva from "konva";

interface MultiSelectProps {
  rotation: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  scaleX: number;
  scaleY: number;
  width: number;
  height: number;
  visible: boolean;
  rectOnTransform?: (e: Konva.KonvaEventObject<Event>) => void;
  rectOnTransformEnd?: (e: Konva.KonvaEventObject<Event>) => void;
  rectOnDragMove?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  rectOnDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  lock?: boolean;
}

export function MultiSelect({
  rotation,
  x,
  y,
  offsetX,
  offsetY,
  scaleX,
  scaleY,
  width,
  height,
  visible,
  rectOnTransform,
  rectOnTransformEnd,
  rectOnDragMove,
  rectOnDragEnd,
  lock = false,
}: MultiSelectProps) {
  const transformerRef = useRef<Konva.Transformer>(null);
  const rectRef = useRef<Konva.Rect>(null);
  
  const refsReady = transformerRef.current && rectRef.current;
  const transformer = transformerRef.current;
  const rect = rectRef.current;
  
  if (refsReady) {
    transformer.moveToTop();
    if (transformer.nodes().length === 0) {
      transformer.nodes([rect]);
    }
  }

  if (!visible) {
    return (
      <>
        <Rect ref={rectRef} />
        <Transformer ref={transformerRef} visible={false} />
      </>
    );
  }
  
  return (
    <>
      <Rect
        ref={rectRef}
        id="multiSelectRect"
        rotation={rotation}
        x={x}
        y={y}
        width={width}
        height={height}
        offsetX={offsetX}
        offsetY={offsetY}
        scaleX={scaleX}
        scaleY={scaleY}
        onTransform={rectOnTransform}
        onTransformEnd={rectOnTransformEnd}
        draggable={!lock}
        onDragMove={rectOnDragMove}
        onDragEnd={rectOnDragEnd}
      />
      <Transformer
        ref={transformerRef}
        id="multiSelectTransformer"
        enabledAnchors={
          lock ? [] : ["top-left", "top-right", "bottom-left", "bottom-right"]
        }
        rotateEnabled={!lock}
        boundBoxFunc={(oldBox, newBox) => {
          return newBox.width < 10 || newBox.height < 10 ? oldBox : newBox;
        }}
      />
    </>
  );
}
