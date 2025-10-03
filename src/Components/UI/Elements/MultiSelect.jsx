import { useRef } from "react";
import { Rect, Transformer } from "react-konva";

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
  lock,
}) {
  // refs
  const refs = {
    transformer: useRef(null),
    rect: useRef(null),
  };
  const refsReady = Object.values(refs).every((ref) => ref.current);
  const transformer = refs.transformer.current;
  const rect = refs.rect.current;
  if (refsReady) {
    transformer.moveToTop();
    if (transformer.nodes().length === 0) transformer.nodes([rect]);
  }

  if (!visible)
    return (
      <>
        <Rect ref={refs.rect} />
        <Transformer ref={refs.transformer} visible={false} />
      </>
    );
  return (
    <>
      <Rect
        ref={refs.rect}
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
        ref={refs.transformer}
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
