import { useState } from "react";
import Konva from "konva";
import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { ClipFuncHelper } from "Components/UI/Elements/ClippedImage";
import { KonvaEventObject } from "konva/lib/Node";
import { CanvasElement, ClippedImageElement } from "Interfaces/Elements";

interface MultiSelectRectProps {
  rotation: number;
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  visible: boolean;
  scaleX: number;
  scaleY: number;
  rectOnTransform: (e: KonvaEventObject<Event>) => void;
  rectOnTransformEnd: (e: KonvaEventObject<Event>) => void;
  rectOnDragMove: (e: KonvaEventObject<DragEvent>) => void;
  rectOnDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  lock?: boolean;
}

export const useMultiSelect = (stage: Konva.Stage | undefined) => {
  const [rectProps, setRectProps] = useState<MultiSelectRectProps | null>(null);
  const { multiSelectIds, setMultiSelectIds } = useAppState();
  const { elements, selected, setSelected, updateElement, updateElements } =
    useElementsContext();

  if (multiSelectIds.size === 0 && rectProps) setRectProps(null);

  const updateRectProps = (rect: Konva.Node, newElements: CanvasElement[]) => {
    const rotation = rect.rotation();
    const x = rect.x();
    const y = rect.y();
    const scale = rect.scaleX();
    const attrs = {
      rotation,
      x,
      y,
      offsetX: rect.offsetX() * scale,
      offsetY: rect.offsetY() * scale,
      width: rect.width() * scale,
      height: rect.height() * scale,
      visible: multiSelectIds.size > 0,
      scaleX: 1.0,
      scaleY: 1.0,
    };
    rect.setAttrs(attrs);
    setRectProps({
      ...attrs,
      rectOnTransform: rectOnTransform(newElements, rotation, x, y),
      rectOnTransformEnd: rectOnTransformEnd(newElements, rotation, x, y),
      rectOnDragMove: rectOnDragMove(newElements, x, y),
      rectOnDragEnd: rectOnDragEnd(newElements, x, y),
    });
  };

  const findShape = (id: string): Konva.Node | undefined => (stage ? stage.find(`#${id}`)[0] : undefined);
  const findElement = (elements: CanvasElement[], id: string): CanvasElement | undefined => 
    elements.find((e: CanvasElement) => e.id === id);

  const lock = [...multiSelectIds].some((id) => {
    const element = findElement(elements, id);
    return element && element.lock;
  });

  const resizeElement = (element: CanvasElement, x: number, y: number, scale: number): CanvasElement => {
    switch (element.type) {
      case "text":
        return {
          ...element,
          x,
          y,
          fontSize: element.fontSize * scale,
        };
      case "path":
      case "flat-svg":
        return {
          ...element,
          x,
          y,
          scaleX: element.scaleX * scale,
          scaleY: element.scaleY * scale,
        };
      case "image":
        const image = findShape(element.id);
        const width = element.width * scale;
        const height = element.height * scale;
        if (image) {
          image.setAttrs({
            scaleX: 1.0,
            scaleY: 1.0,
            width,
            height,
          });
          image.cache();
        }
        return {
          ...element,
          x,
          y,
          width,
          height,
          innerOffsetX: element.innerOffsetX * scale,
          innerOffsetY: element.innerOffsetY * scale,
          innerWidth: element.innerWidth * scale,
          innerHeight: element.innerHeight * scale,
          shadowOffsetX: (element.shadowOffsetX ?? 0) * scale,
          shadowOffsetY: (element.shadowOffsetY ?? 0) * scale,
          scale: 1.0,
        };
      case "clippedImage":
        return {
          ...element,
          imageDeltaX: element.imageDeltaX * scale,
          imageDeltaY: element.imageDeltaY * scale,
          imageWidth: element.imageWidth * scale,
          imageHeight: element.imageHeight * scale,
          shapeX: x,
          shapeY: y,
          shapeWidth: element.shapeWidth * scale,
          shapeHeight: element.shapeHeight * scale,
          shadowOffsetX: (element.shadowOffsetX ?? 0) * scale,
          shadowOffsetY: (element.shadowOffsetY ?? 0) * scale,
        };
      case "circle":
      case "ellipse":
        return {
          ...element,
          x,
          y,
          radiusX: element.radiusX * scale,
          radiusY: element.radiusY * scale,
          scaleX: element.scaleX * scale,
          scaleY: element.scaleY * scale,
        };
      case "rectangle":
        return {
          ...element,
          x,
          y,
          width: element.width * scale,
          height: element.height * scale,
          scaleX: element.scaleX * scale,
          scaleY: element.scaleY * scale,
        };
      case "star":
        return {
          ...element,
          x,
          y,
          innerRadius: element.innerRadius * scale,
          outerRadius: element.outerRadius * scale,
          scaleX: element.scaleX * scale,
          scaleY: element.scaleY * scale,
        };
      case "triangle":
        return {
          ...element,
          x,
          y,
          width: element.width * scale,
          height: element.height * scale,
          scaleX: element.scaleX * scale,
          scaleY: element.scaleY * scale,
        };
      default:
        return element;
    }
  };

  const transformClippedImage = (
    element: ClippedImageElement, 
    shape: Konva.Node, 
    x: number, 
    y: number, 
    scale: number, 
    rotation: number
  ) => {
    const clipFuncHelper = new ClipFuncHelper(element);
    const {
      id,
      imageWidth,
      imageHeight,
      shapeWidth,
      shapeHeight,
      imageDeltaX,
      imageDeltaY,
      flipX,
      flipY,
    } = element;
    const offsetX = imageWidth / 2;
    const offsetY = imageHeight / 2;
    shape.setAttrs({
      x,
      y,
      width: imageWidth * scale,
      height: imageHeight * scale,
      offsetX: (flipX ? offsetX + imageDeltaX : offsetX - imageDeltaX) * scale,
      offsetY: (flipY ? offsetY + imageDeltaY : offsetY - imageDeltaY) * scale,
      rotation,
    });
    const shadowShape = findShape("shadow" + id);
    if (shadowShape) {
      shadowShape.setAttrs({ visible: false });
    }
    const groupShape = findShape("group" + id);
    if (groupShape) {
      groupShape.setAttrs({
        clipFunc: clipFuncHelper.group(
          {
            ...element,
            shapeX: x,
            shapeY: y,
            shapeWidth: shapeWidth * scale,
            shapeHeight: shapeHeight * scale,
            rotation,
          },
          false
        ),
      });
    }
  };

  const rectOnResize = (rect: Konva.Node, elements: CanvasElement[], xBase: number, yBase: number) => {
    if (lock) return;
    const scale = rect.scaleX();
    const rx = rect.x();
    const ry = rect.y();

    multiSelectIds.forEach((id) => {
      const shape = findShape(id);
      const element = findElement(elements, id);
      if (!shape || !element) return;
      
      if (element.type === "clippedImage") {
        const dx = element.shapeX - xBase;
        const dy = element.shapeY - yBase;
        const x = rx + dx * scale;
        const y = ry + dy * scale;
        transformClippedImage(
          element,
          shape,
          x,
          y,
          scale,
          element.rotation ?? 0
        );
        return;
      }
      if (element.type === "text" || element.type === "image" || element.type === "path" || element.type === "flat-svg" || element.type === "circle" || element.type === "ellipse" || element.type === "rectangle" || element.type === "star" || element.type === "triangle") {
        const { x, y } = element;
        const dx = x - xBase;
        const dy = y - yBase;
        shape.setAttrs({
          x: rx + dx * scale,
          y: ry + dy * scale,
          scaleX: element.scaleX * scale,
          scaleY: element.scaleY * scale,
        });
      }
    });
  };

  const rectOnResizeEnd = (rect: Konva.Node, elements: CanvasElement[], xBase: number, yBase: number) => {
    if (lock) return;
    const scale = rect.scaleX();
    const rx = rect.x();
    const ry = rect.y();
    const updateElementFunc = (element: CanvasElement): CanvasElement => {
      const x = element.type === "clippedImage" ? element.shapeX : 'x' in element ? element.x : 0;
      const y = element.type === "clippedImage" ? element.shapeY : 'y' in element ? element.y : 0;
      const dx = x - xBase;
      const dy = y - yBase;
      return resizeElement(element, rx + dx * scale, ry + dy * scale, scale);
    };

    const newElements = elements.map((e: CanvasElement) =>
      msIncludes(e.id) ? updateElementFunc(e) : e
    );
    multiSelectIds.forEach((id) => {
      const element = findElement(newElements, id);
      if (!element) return;
      
      if (element.type === "text") {
        const shape = findShape(id);
        if (shape) {
          shape.setAttrs({
            scaleX: element.scaleX,
            scaleY: element.scaleY,
            width: shape.width() * scale,
            heigth: shape.height() * scale,
          });
        }
        return;
      }
      const shape = findShape(id);
      if (element.type === "clippedImage" && shape) {
        const clipFuncHelper = new ClipFuncHelper(element);
        const {
          id,
          shapeX,
          shapeY,
          imageWidth,
          imageHeight,
          imageDeltaX,
          imageDeltaY,
          flipX,
          flipY,
        } = element;
        const offsetX = imageWidth / 2;
        const offsetY = imageHeight / 2;
        shape.setAttrs({
          x: shapeX,
          y: shapeY,
          width: imageWidth,
          height: imageHeight,
          offsetX: flipX ? offsetX + imageDeltaX : offsetX - imageDeltaX,
          offsetY: flipY ? offsetY + imageDeltaY : offsetY - imageDeltaY,
        });
        const shadowShape = findShape("shadow" + id);
        if (shadowShape) {
          shadowShape.setAttrs({ visible: true });
        }
        const groupShape = findShape("group" + id);
        if (groupShape) {
          groupShape.setAttrs({
            clipFunc: clipFuncHelper.group(element, false),
          });
        }
        return;
      }
    });
    updateRectProps(rect, newElements);
    updateElements(newElements as CanvasElement[]);
  };

  const rectOnTransform = (elements: CanvasElement[], rotationBase: number, xBase: number, yBase: number) => 
    (_e: KonvaEventObject<Event>) => {
      if (lock) return;
      const rect = findShape("multiSelectRect");
      if (!rect) return;
      
      const rx = rect.x();
      const ry = rect.y();
      const rotation = rect.rotation();
      const dr = rotation - rotationBase;
      if (Math.abs(dr) < 1e-5) {
        rectOnResize(rect, elements, xBase, yBase);
        return;
      }
      const rad = (dr / 180) * Math.PI;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      multiSelectIds.forEach((id) => {
        const shape = findShape(id);
        const element = findElement(elements, id);
        if (!shape || !element) return;
        
        const rotation = (element.rotation ?? 0) + dr;
        const dx = (element.type === "clippedImage" ? element.shapeX : 'x' in element ? element.x : 0) - rx;
        const dy = (element.type === "clippedImage" ? element.shapeY : 'y' in element ? element.y : 0) - ry;
        const x = rx + dx * cos - dy * sin;
        const y = ry + dx * sin + dy * cos;
        if (element.type === "clippedImage") {
          transformClippedImage(element, shape, x, y, rect.scaleX(), rotation);
        } else {
          shape.setAttrs({ rotation, x, y });
        }
      });
    };

  const rectOnTransformEnd = (elements: CanvasElement[], rotationBase: number, xBase: number, yBase: number) => 
    (_e: KonvaEventObject<Event>) => {
      if (lock) return;
      const rect = findShape("multiSelectRect");
      if (!rect) return;
      
      const rx = rect.x();
      const ry = rect.y();
      const rotation = rect.rotation();
      const dr = rotation - rotationBase;
      if (Math.abs(dr) < 1e-5) {
        rectOnResizeEnd(rect, elements, xBase, yBase);
        return;
      }
      const rad = (dr / 180) * Math.PI;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const updateElementFunc = (element: CanvasElement): CanvasElement => {
        const clippedImage = element.type === "clippedImage";
        const x = clippedImage ? element.shapeX : 'x' in element ? element.x : 0;
        const y = clippedImage ? element.shapeY : 'y' in element ? element.y : 0;
        const rotation = element.rotation ?? 0;
        const dx = x - rx;
        const dy = y - ry;
        if (clippedImage) {
          const shadowShape = findShape("shadow" + element.id);
          if (shadowShape) {
            shadowShape.setAttrs({ visible: true });
          }
          return {
            ...element,
            rotation: rotation + dr,
            shapeX: rx + dx * cos - dy * sin,
            shapeY: ry + dx * sin + dy * cos,
          };
        } else if ('x' in element && 'y' in element) {
          return {
            ...element,
            rotation: rotation + dr,
            x: rx + dx * cos - dy * sin,
            y: ry + dx * sin + dy * cos,
          };
        }
        return element;
      };
      const newElements = elements.map((e: CanvasElement) =>
        msIncludes(e.id) ? updateElementFunc(e) : e
      );
      updateRectProps(rect, newElements);
      updateElements(newElements as CanvasElement[]);
    };

  const rectOnDragMove = (elements: CanvasElement[], xBase: number, yBase: number) => 
    (e: KonvaEventObject<DragEvent>) => {
      if (lock) return;
      const target = e.target;
      const dx = target.x() - xBase;
      const dy = target.y() - yBase;
      elements
        .filter((e: CanvasElement) => multiSelectIds.has(e.id))
        .forEach((e: CanvasElement) => {
          const shape = findShape(e.id);
          if (!shape) return;
          
          if (e.type === "clippedImage") {
            const clipFuncHelper = new ClipFuncHelper(e);
            const x = e.shapeX + dx;
            const y = e.shapeY + dy;
            const shapeNode = findShape(e.id);
            if (shapeNode) shapeNode.setAttrs({ x, y });
            const shadowNode = findShape("shadow" + e.id);
            if (shadowNode) shadowNode.setAttrs({ x, y });
            const groupNode = findShape("group" + e.id);
            if (groupNode) {
              groupNode.setAttrs({
                clipFunc: clipFuncHelper.group(
                  { ...e, shapeX: x, shapeY: y },
                  false
                ),
              });
            }
          } else if ('x' in e && 'y' in e) {
            shape.setAttrs({ x: e.x + dx, y: e.y + dy });
          }
        });
    };

  const rectOnDragEnd = (elements: CanvasElement[], xBase: number, yBase: number) => 
    (e: KonvaEventObject<DragEvent>) => {
      if (lock) return;
      const dx = e.target.x() - xBase;
      const dy = e.target.y() - yBase;
      const move = (element: CanvasElement): CanvasElement => {
        if (!multiSelectIds.has(element.id)) return element;
        if (element.type === "clippedImage") {
          return {
            ...element,
            shapeX: element.shapeX + dx,
            shapeY: element.shapeY + dy,
          };
        } else if ('x' in element && 'y' in element) {
          return {
            ...element,
            x: element.x + dx,
            y: element.y + dy,
          };
        }
        return element;
      };
      const newElements = elements.map(move);
      updateElements(newElements as CanvasElement[]);
      updateRectProps(e.target as Konva.Node, newElements);
    };

  const msProps = (() => {
    if (rectProps) {
      const rect = findShape("multiSelectRect");
      if (rect) {
        const dx = rect.x() - rectProps.x;
        const dy = rect.y() - rectProps.y;
        if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
          return {
            ...rectProps,
            x: rect.x(),
            y: rect.y(),
          };
        }
      }
      return rectProps;
    }
    const newRectProps = getMultiSelectProps(
      elements,
      multiSelectIds,
      findShape
    );
    const { x, y } = newRectProps;
    return {
      ...newRectProps,
      rectOnTransform: rectOnTransform(elements, 0, x, y),
      rectOnTransformEnd: rectOnTransformEnd(elements, 0, x, y),
      rectOnDragMove: rectOnDragMove(elements, x, y),
      rectOnDragEnd: rectOnDragEnd(elements, x, y),
      lock,
    };
  })();

  const msIncludes = (id: string): boolean => multiSelectIds.has(id);

  const msAdd = (id: string) => {
    if (id === selected) return;
    const copy = new Set(multiSelectIds);
    if (selected) copy.add(selected);
    if (copy.size === 0) {
      setSelected(id);
    } else {
      copy.add(id);
      setMultiSelectIds(copy);
      setRectProps(null);
      if (selected) setSelected("");
    }
  };

  const msAddAll = (ids: string[]) => {
    const copy = new Set(multiSelectIds);
    if (selected) copy.add(selected);
    ids.forEach((id: string) => {
      copy.add(id);
    });
    setMultiSelectIds(copy);
    setRectProps(null);
    if (selected) setSelected("");
  };

  const msClear = () => {
    setMultiSelectIds(new Set());
    setRectProps(null);
  };

  const msDelete = (id: string) => {
    const copyIds = new Set(multiSelectIds);
    copyIds.delete(id);
    if (copyIds.size === 1) {
      const [id] = Array.from(copyIds);
      msClear();
      setSelected(id);
    } else {
      setMultiSelectIds(copyIds);
      setRectProps(null);
      if (selected) setSelected("");
    }
  };

  const msDeleteAll = (ids: string[]) => {
    const copyIds = new Set(multiSelectIds);
    ids.forEach((id: string) => {
      copyIds.delete(id);
    });
    if (copyIds.size === 1) {
      const [id] = Array.from(copyIds);
      msClear();
      setSelected(id);
    } else {
      setMultiSelectIds(copyIds);
      setRectProps(null);
      if (selected) setSelected("");
    }
  };

  const msClick = (element: CanvasElement) => (e: KonvaEventObject<MouseEvent>) => {
    const id = element.id;
    if (element.group && element.group.length > 0) {
      if (e.evt.shiftKey) {
        if (msIncludes(id)) {
          msDeleteAll(element.group);
        } else {
          msAddAll(element.group);
        }
      } else {
        setMultiSelectIds(new Set(element.group));
        setSelected("");
      }
    } else if (e.evt.shiftKey) {
      if (msIncludes(id)) {
        msDelete(id);
      } else {
        msAdd(id);
      }
    } else if (msIncludes(id)) {
      return;
    } else {
      msClear();
      setSelected(element.id);
    }
  };

  const msDragMove = (element: CanvasElement) => (e: KonvaEventObject<DragEvent>) => {
    if (lock) return;
    const target = e.target;
    const dx = target.x() - (element.type === "clippedImage" ? 0 : 'x' in element ? element.x : 0);
    const dy = target.y() - (element.type === "clippedImage" ? 0 : 'y' in element ? element.y : 0);
    const move = (e: CanvasElement) => {
      if (e.type === "clippedImage") {
        const clipFuncHelper = new ClipFuncHelper(e);
        const x = e.shapeX + dx;
        const y = e.shapeY + dy;
        const shapeNode = findShape(e.id);
        if (shapeNode) shapeNode.setAttrs({ x, y });
        const shadowNode = findShape("shadow" + e.id);
        if (shadowNode) shadowNode.setAttrs({ x, y });
        const groupNode = findShape("group" + e.id);
        if (groupNode) {
          groupNode.setAttrs({
            clipFunc: clipFuncHelper.group({ ...e, shapeX: x, shapeY: y }, false),
          });
        }
      } else if ('x' in e && 'y' in e) {
        const shapeNode = findShape(e.id);
        if (shapeNode) {
          shapeNode.setAttrs({
            x: e.x + dx,
            y: e.y + dy,
          });
        }
      }
    };
    if (!multiSelectIds.has(element.id)) {
      if (element.group) {
        element.group
          .map((id: string) => findElement(elements, id))
          .filter((e): e is CanvasElement => e !== undefined)
          .forEach(move);
      }
      return;
    }
    elements
      .filter((e: CanvasElement) => multiSelectIds.has(e.id) && e.id !== element.id)
      .forEach(move);
    const msRect = findShape("multiSelectRect");
    if (msRect) {
      msRect.setAttrs({
        x: msProps.x + dx,
        y: msProps.y + dy,
      });
    }
  };

  const msDragEnd = (element: CanvasElement) => (e: KonvaEventObject<DragEvent>) => {
    if (lock) return;
    if (!msIncludes(element.id)) {
      if (element.group && element.group.length > 0) {
        const dx = e.target.x() - (element.type === "clippedImage" ? 0 : 'x' in element ? element.x : 0);
        const dy = e.target.y() - (element.type === "clippedImage" ? 0 : 'y' in element ? element.y : 0);
        updateElements(
          element.group
            .map((id: string) => {
              const e = findElement(elements, id);
              if (!e) return null;
              if (e.type === "clippedImage") {
                return {
                  ...e,
                  shapeX: e.shapeX + dx,
                  shapeY: e.shapeY + dy,
                };
              } else if ('x' in e && 'y' in e) {
                return {
                  ...e,
                  x: e.x + dx,
                  y: e.y + dy,
                };
              }
              return e;
            })
            .filter((e): e is CanvasElement => e !== null) as CanvasElement[]
        );
        setMultiSelectIds(new Set(element.group));
        setSelected("");
      } else {
        if (element.type === "clippedImage") {
          updateElement({
            id: element.id,
            shapeX: element.shapeX + e.target.x(),
            shapeY: element.shapeY + e.target.y(),
          } as CanvasElement);
        } else if ('x' in element && 'y' in element) {
          updateElement({
            id: element.id,
            x: e.target.x(),
            y: e.target.y(),
          } as CanvasElement);
        }
        setSelected(element.id);
        msClear();
      }
      return;
    }

    const target = e.target;
    const dx = target.x() - (element.type === "clippedImage" ? 0 : 'x' in element ? element.x : 0);
    const dy = target.y() - (element.type === "clippedImage" ? 0 : 'y' in element ? element.y : 0);
    const move = (element: CanvasElement): CanvasElement => {
      if (!multiSelectIds.has(element.id)) return element;
      if (element.type === "clippedImage") {
        return {
          ...element,
          shapeX: element.shapeX + dx,
          shapeY: element.shapeY + dy,
        };
      } else if ('x' in element && 'y' in element) {
        return {
          ...element,
          x: element.x + dx,
          y: element.y + dy,
        };
      }
      return element;
    };
    const newElements = elements.map(move);
    updateElements(newElements as CanvasElement[]);
    const msRect = findShape("multiSelectRect");
    if (msRect) {
      updateRectProps(msRect, newElements);
    }
  };

  const msSelectionRectStart = (stage: Konva.Stage) => {
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;
    const selectionRect = findShape("selectionRect");
    if (selectionRect) {
      selectionRect.setAttrs({
        x,
        y,
        width: 0,
        height: 0,
        visible: true,
      });
    }
  };

  const msSelectionRectMove = (stage: Konva.Stage) => {
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const { x, y } = pos;
    const selection = findShape("selectionRect");
    if (!selection) return;
    const rx = selection.x();
    const ry = selection.y();
    selection.setAttrs({ width: x - rx, height: y - ry });
  };

  const msSelectionRectEnd = () => {
    const rect = findShape("selectionRect");
    if (!rect || !rect.visible()) return;
    const x = rect.x();
    const y = rect.y();
    const width = rect.width();
    const height = rect.height();
    const left = Math.min(x, x + width);
    const right = Math.max(x, x + width);
    const top = Math.min(y, y + height);
    const bottom = Math.max(y, y + height);
    const isSelectedElement = (e: CanvasElement): boolean => {
      if (e.lock) return false;
      if ('x' in e && 'y' in e) {
        return e.x > left && e.x < right && e.y > top && e.y < bottom;
      }
      return false;
    };
    rect.setAttrs({
      visible: false,
      width: 0,
      height: 0,
    });
    const selectedElements = elements.filter(isSelectedElement);
    const groupsIds: string[] = [];
    selectedElements.forEach((e: CanvasElement) => {
      if (e.group) {
        groupsIds.push(...e.group);
      }
    });
    const ids = [
      ...new Set([...selectedElements.map((e: CanvasElement) => e.id), ...groupsIds]),
    ];
    if (ids)
      if (ids.length === 1) {
        setSelected(ids[0]);
      } else {
        setMultiSelectIds(new Set(ids));
        setRectProps(null);
        if (selected) setSelected("");
      }
  };

  const msDraggable = (id: string): boolean => !msIncludes(id) || !lock;

  const msMouseDown = (element: CanvasElement | null) => () => {
    if (!element || element.lock) {
      if (stage) {
        msSelectionRectStart(stage);
      }
      setMultiSelectIds(new Set());
    }
  };

  const isGrouped = (): boolean => {
    const getElementGroup = (id: string): string[] => {
      const element = findElement(elements, id);
      return (element && element.group) || [];
    };
    const equal = (xs: string[], ys: string[]): boolean =>
      xs.length === ys.length && xs.every((x, i) => x === ys[i]);
    const allEqual = (list: string[][]): string[] | number => {
      if (list.length === 0) return NaN;
      const first = list[0];
      return list.reduce((a: string[] | number, b: string[]) => 
        (typeof a !== 'number' && equal(a, b) ? a : NaN), first
      );
    };
    const groups = [...multiSelectIds].map(getElementGroup);
    const result = allEqual(groups);
    return groups.length > 0 && typeof result !== 'number' && result.length > 0;
  };

  const msGroupClick = () => {
    const group = isGrouped() ? [] : [...multiSelectIds];
    const updateGroup = (e: CanvasElement): CanvasElement => {
      if (!multiSelectIds.has(e.id)) return e;
      return {
        ...e,
        group,
      };
    };
    updateElements(elements.map(updateGroup) as CanvasElement[]);
  };

  return {
    msProps,
    msClick,
    msDraggable,
    msDragMove,
    msDragEnd,
    msSelectionRectStart,
    msSelectionRectMove,
    msSelectionRectEnd,
    msMouseDown,
    msGroupClick,
    msGrouped: isGrouped(),
  };
};

interface VertexPoint {
  x: number;
  y: number;
}

function getMultiSelectProps(
  elements: CanvasElement[], 
  multiSelectIds: Set<string>, 
  findShape: (id: string) => Konva.Node | undefined
) {
  const allVertices = elements
    .filter((e: CanvasElement) => multiSelectIds.has(e.id))
    .map((e: CanvasElement) => vertices(e, findShape))
    .flat();
  const xs = allVertices.map((v: VertexPoint) => v.x);
  const ys = allVertices.map((v: VertexPoint) => v.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);
  const width = xMax - xMin;
  const height = yMax - yMin;
  return {
    rotation: 0,
    x: xMin + width / 2,
    y: yMin + height / 2,
    offsetX: width / 2,
    offsetY: height / 2,
    scaleX: 1.0,
    scaleY: 1.0,
    width,
    height,
    visible: multiSelectIds.size > 0,
  };
}

function vertices(element: CanvasElement, findShape: (id: string) => Konva.Node | undefined): VertexPoint[] {
  const { id, scaleX, scaleY, type } = element;
  const rotation = element.rotation ?? 0;
  const cos = Math.cos((rotation / 180) * Math.PI);
  const sin = Math.sin((rotation / 180) * Math.PI);

  let x: number = 0, y: number = 0, width: number = 0, height: number = 0;
  
  if (type === "image" && element.isCropped) {
    width = element.innerWidth;
    height = element.innerHeight;
    x = element.x;
    y = element.y;
  } else if (type === "flat-svg") {
    width = element.width * scaleX * 2;
    height = element.height * scaleY * 2;
    x = element.x + width / 4;
    y = element.y + height / 4;
  } else if (type === "text") {
    const node = findShape(id);
    if (!node) return [];
    width = node.width() * scaleX;
    height = node.height() * scaleY;
    x = element.x + (width / 2) * cos - (height / 2) * sin;
    y = element.y + (width / 2) * sin + (height / 2) * cos;
  } else if (type === "clippedImage") {
    width = element.shapeWidth;
    height = element.shapeHeight;
    x = element.shapeX;
    y = element.shapeY;
  } else if (type === "path" || type === "rectangle") {
    width = element.width * scaleX;
    height = element.height * scaleY;
    x = element.x;
    y = element.y;
  } else if (type === "circle" || type === "ellipse") {
    width = element.radiusX * 2 * scaleX;
    height = element.radiusY * 2 * scaleY;
    x = element.x;
    y = element.y;
  } else if (type === "star") {
    width = element.outerRadius * 2 * scaleX;
    height = element.outerRadius * 2 * scaleY;
    x = element.x;
    y = element.y;
  } else if (type === "triangle") {
    width = element.width * scaleX;
    height = element.height * scaleY;
    x = element.x;
    y = element.y;
  }
  
  const absXY = (dx: number, dy: number): VertexPoint => ({
    x: x + dx * cos - dy * sin,
    y: y + dx * sin + dy * cos,
  });
  const widthHalf = width / 2;
  const heightHalf = height / 2;
  return [
    absXY(-widthHalf, -heightHalf),
    absXY(widthHalf, -heightHalf),
    absXY(widthHalf, heightHalf),
    absXY(-widthHalf, heightHalf),
  ];
}

type AlignType = "top" | "middle" | "bottom" | "left" | "center" | "right";

export function alignMultiSelect(
  stage: Konva.Stage | undefined,
  align: AlignType,
  elements: CanvasElement[],
  updateElements: (elements: CanvasElement[]) => void,
  multiSelectIds: Set<string>
) {
  const rect = stage ? stage.find(`#multiSelectRect`)[0] : undefined;
  if (!rect || !stage) return { stage, dx: 0, dy: 0 };
  const x = rect.x();
  const y = rect.y();
  const scaleX = rect.scaleX();
  const scaleY = rect.scaleY();
  const width = rect.width() * scaleX;
  const height = rect.height() * scaleY;
  const rotation = rect.rotation();
  const cos = Math.cos((rotation / 180) * Math.PI);
  const sin = Math.sin((rotation / 180) * Math.PI);
  const absXY = (dx: number, dy: number): VertexPoint => ({
    x: x + dx * cos - dy * sin,
    y: y + dx * sin + dy * cos,
  });
  const widthHalf = width / 2;
  const heightHalf = height / 2;
  const verts = [
    absXY(-widthHalf, -heightHalf),
    absXY(widthHalf, -heightHalf),
    absXY(widthHalf, heightHalf),
    absXY(-widthHalf, heightHalf),
  ];
  const xs = verts.map((v: VertexPoint) => v.x);
  const ys = verts.map((v: VertexPoint) => v.y);
  let nx = x;
  let ny = y;
  if (align === "top") ny = y - Math.min(...ys);
  if (align === "middle") ny = stage.height() / 2;
  if (align === "bottom") ny = stage.height() - (Math.max(...ys) - y);
  if (align === "left") nx = x - Math.min(...xs);
  if (align === "center") nx = stage.width() / 2;
  if (align === "right") nx = stage.width() - (Math.max(...xs) - x);
  const dx = nx - x;
  const dy = ny - y;
  rect.setAttrs({
    x: rect.x() + dx,
    y: rect.y() + dy,
  });
  updateElements(
    elements.map((e: CanvasElement) => {
      if (!multiSelectIds.has(e.id)) return e as CanvasElement;
      if (e.type === "clippedImage") {
        return {
          ...e,
          shapeX: e.shapeX + dx,
          shapeY: e.shapeY + dy,
        } as CanvasElement;
      } else if ('x' in e && 'y' in e) {
        return {
          ...e,
          x: e.x + dx,
          y: e.y + dy,
        } as CanvasElement;
      }
      return e as CanvasElement;
    })
  );
}

export function alignMultiSelect2(
  stage: Konva.Stage,
  align: AlignType,
  elements: CanvasElement[],
  updateElements: (elements: CanvasElement[]) => void,
  multiSelectIds: Set<string>
) {
  const multiSelected = (e: CanvasElement): boolean => multiSelectIds.has(e.id);
  if (align === "middle" || align === "center") {
    const cx = stage.width() / 2;
    const cy = stage.height() / 2;
    updateElements(
      elements.map((e: CanvasElement) => {
        if (!multiSelected(e)) return e;
        if (align === "middle") {
          return e.type === "clippedImage"
            ? ({ ...e, shapeX: cx } as CanvasElement)
            : ('x' in e ? { ...e, x: cx } : e) as CanvasElement;
        }
        if (align === "center") {
          return e.type === "clippedImage"
            ? ({ ...e, shapeY: cy } as CanvasElement)
            : ('y' in e ? { ...e, y: cy } : e) as CanvasElement;
        }
        return e;
      })
    );
    return;
  }

  const findShape = (id: string): Konva.Node | undefined => stage.find(`#${id}`)[0];
  const allVertices = elements.map((e: CanvasElement) =>
    multiSelected(e) ? vertices(e, findShape) : null
  );
  const flatVertices = allVertices.filter((v): v is VertexPoint[] => v !== null).flat();
  const getTop = (verts: VertexPoint[]): number => Math.min(...verts.map((v: VertexPoint) => v.y));
  const getBottom = (verts: VertexPoint[]): number => Math.max(...verts.map((v: VertexPoint) => v.y));
  const getLeft = (verts: VertexPoint[]): number => Math.min(...verts.map((v: VertexPoint) => v.x));
  const getRight = (verts: VertexPoint[]): number => Math.max(...verts.map((v: VertexPoint) => v.x));

  const func: Record<string, (verts: VertexPoint[]) => number> = {
    top: getTop,
    bottom: getBottom,
    left: getLeft,
    right: getRight,
  };

  const targetFunc = func[align];
  if (!targetFunc) return;

  const target = targetFunc(flatVertices);
  updateElements(
    elements.map((e: CanvasElement, i: number) => {
      if (!multiSelected(e)) return e;
      const vs = allVertices[i];
      if (!vs) return e;
      const dy = align === "top" || align === "bottom" ? target - targetFunc(vs) : 0;
      const dx = align === "left" || align === "right" ? target - targetFunc(vs) : 0;
      if (e.type === "clippedImage") {
        return { ...e, shapeX: e.shapeX + dx, shapeY: e.shapeY + dy } as CanvasElement;
      } else if ('x' in e && 'y' in e) {
        return { ...e, x: e.x + dx, y: e.y + dy } as CanvasElement;
      }
      return e;
    })
  );
}
