import Konva from "konva";
import { useState } from "react";

export const useDraggable = ({ updateElement }: any) => {
  const [draggable, setDraggable] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const unSelect = (e?: any) => {
    if (e === undefined) {
      setSelected(null);
      return;
    }

    const emptyClicked = e.target === e.target.getStage();

    if (emptyClicked) {
      setSelected(null);
    }
  };

  const onDragStart = (
    _: Konva.KonvaEventObject<DragEvent>,
    shape: Konva.ShapeConfig
  ) => {
    setSelected(shape.id);
  };

  const onDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    updateElement(
      {
        id: selected,
        x: e.target.x(),
        y: e.target.y(),
      },
      {
        saveHistory: false,
      }
    );
  };

  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    updateElement({
      id: selected,
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return {
    draggable,
    setDraggable,

    selected,
    setSelected,
    unSelect,

    onDragStart,
    onDragEnd,
    onDragMove,
  };
};
