import Konva from "konva";
import { useState } from "react";
import { UseDraggableParams } from "Interfaces";

export const useDraggable = ({ updateElement }: UseDraggableParams) => {
  const [draggable, setDraggable] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const unSelect = (e?: Konva.KonvaEventObject<MouseEvent>) => {
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
    setSelected(shape.id as string);
  };

  const onDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    updateElement(
      {
        id: selected as string,
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
      id: selected as string,
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
