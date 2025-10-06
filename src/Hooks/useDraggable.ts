import Konva from "konva";
import { useState } from "react";
import { UseDraggableParams } from "Interfaces";
import { CanvasElement } from "Interfaces/Elements";

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
    shape: CanvasElement
  ) => {
    setSelected(shape.id as string);
  };

  const onDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    const config: any = {
      id: selected as string,
    };
    
    // ClippedImageElement uses shapeX/shapeY instead of x/y
    const shape = e.target;
    const attrs = shape.attrs;
    if (attrs.type === "clippedImage") {
      config.shapeX = shape.x();
      config.shapeY = shape.y();
    } else {
      config.x = shape.x();
      config.y = shape.y();
    }
    
    updateElement(config, { saveHistory: false });
  };

  const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const config: any = {
      id: selected as string,
    };
    
    // ClippedImageElement uses shapeX/shapeY instead of x/y
    const shape = e.target;
    const attrs = shape.attrs;
    if (attrs.type === "clippedImage") {
      config.shapeX = shape.x();
      config.shapeY = shape.y();
    } else {
      config.x = shape.x();
      config.y = shape.y();
    }
    
    updateElement(config);
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
