import { useState } from "react";
import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { ClipFuncHelper } from "Components/UI/Elements/ClippedImage";

export const useMultiSelect = (stage) => {
  const [rectProps, setRectProps] = useState(null);
  const { multiSelectIds, setMultiSelectIds } = useAppState();
  const { elements, selected, setSelected, updateElement, updateElements } =
    useElementsContext();

  if (multiSelectIds.size === 0 && rectProps) setRectProps(null);

  const updateRectProps = (rect, newElements) => {
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

  const findShape = (id) => (stage ? stage.find(`#${id}`)[0] : undefined);
  const findElement = (elements, id) => elements.find((e) => e.id === id);

  const lock = [...multiSelectIds].some((id) => {
    const element = findElement(elements, id);
    return element && element.lock;
  });

  const resizeElement = (element, x, y, scale) => {
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
        image.setAttrs({
          scaleX: 1.0,
          scaleY: 1.0,
          width,
          height,
        });
        image.cache();
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
          shadowOffsetX: element.shadowOffsetX * scale,
          shadowOffsetY: element.shadowOffsetY * scale,
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
          shadowOffsetX: element.shadowOffsetX * scale,
          shadowOffsetY: element.shadowOffsetY * scale,
        };
      default:
        return element;
    }
  };

  const transformClippedImage = (element, shape, x, y, scale, rotation) => {
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
    findShape("shadow" + id).setAttrs({ visible: false });
    findShape("group" + id).setAttrs({
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
  };

  const rectOnResize = (rect, elements, xBase, yBase) => {
    if (lock) return;
    const scale = rect.scaleX();
    const rx = rect.x();
    const ry = rect.y();

    multiSelectIds.forEach((id) => {
      const shape = findShape(id);
      const element = findElement(elements, id);
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
      const { x, y } = element;
      const dx = x - xBase;
      const dy = y - yBase;
      shape.setAttrs({
        x: rx + dx * scale,
        y: ry + dy * scale,
        scaleX: element.scaleX * scale,
        scaleY: element.scaleY * scale,
      });
    });
  };
  const rectOnResizeEnd = (rect, elements, xBase, yBase) => {
    if (lock) return;
    const scale = rect.scaleX();
    const rx = rect.x();
    const ry = rect.y();
    const updateElement = (element) => {
      const x = element.type === "clippedImage" ? element.shapeX : element.x;
      const y = element.type === "clippedImage" ? element.shapeY : element.y;
      const dx = x - xBase;
      const dy = y - yBase;
      return resizeElement(element, rx + dx * scale, ry + dy * scale, scale);
    };

    const newElements = elements.map((e) =>
      msIncludes(e.id) ? updateElement(e) : e
    );
    multiSelectIds.forEach((id) => {
      const element = findElement(newElements, id);
      if (element.type === "text") {
        const shape = findShape(id);
        shape.setAttrs({
          scaleX: element.scaleX,
          scaleY: element.scaleY,
          width: shape.width() * scale,
          heigth: shape.height() * scale,
        });
        return;
      }
      const shape = findShape(id);
      if (element.type === "clippedImage") {
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
        findShape("shadow" + id).setAttrs({ visible: true });
        findShape("group" + id).setAttrs({
          clipFunc: clipFuncHelper.group(element, false),
        });
        return;
      }
    });
    updateRectProps(rect, newElements);
    updateElements(newElements);
  };

  const rectOnTransform = (elements, rotationBase, xBase, yBase) => (e) => {
    if (lock) return;
    const rect = findShape("multiSelectRect");
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
      const rotation = (element.rotation ?? 0) + dr;
      const dx =
        (element.type === "clippedImage" ? element.shapeX : element.x) - rx;
      const dy =
        (element.type === "clippedImage" ? element.shapeY : element.y) - ry;
      const x = rx + dx * cos - dy * sin;
      const y = ry + dx * sin + dy * cos;
      if (element.type === "clippedImage") {
        transformClippedImage(element, shape, x, y, rect.scaleX(), rotation);
      } else {
        shape.setAttrs({ rotation, x, y });
      }
    });
  };
  const rectOnTransformEnd = (elements, rotationBase, xBase, yBase) => (e) => {
    if (lock) return;
    const rect = findShape("multiSelectRect");
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
    const updateElement = (element) => {
      const clippedImage = element.type === "clippedImage";
      const x = clippedImage ? element.shapeX : element.x;
      const y = clippedImage ? element.shapeY : element.y;
      const rotation = element.rotation ?? 0;
      const dx = x - rx;
      const dy = y - ry;
      if (clippedImage) {
        findShape("shadow" + element.id).setAttrs({ visible: true });
        return {
          ...element,
          rotation: rotation + dr,
          shapeX: rx + dx * cos - dy * sin,
          shapeY: ry + dx * sin + dy * cos,
        };
      } else {
        return {
          ...element,
          rotation: rotation + dr,
          x: rx + dx * cos - dy * sin,
          y: ry + dx * sin + dy * cos,
        };
      }
    };
    const newElements = elements.map((e) =>
      msIncludes(e.id) ? updateElement(e) : e
    );
    updateRectProps(rect, newElements);
    updateElements(newElements);
  };
  const rectOnDragMove = (elements, xBase, yBase) => (e) => {
    if (lock) return;
    const target = e.target;
    const dx = target.x() - xBase;
    const dy = target.y() - yBase;
    elements
      .filter((e) => multiSelectIds.has(e.id))
      .forEach((e) => {
        const shape = findShape(e.id);
        if (e.type === "clippedImage") {
          const clipFuncHelper = new ClipFuncHelper(e);
          const x = e.shapeX + dx;
          const y = e.shapeY + dy;
          findShape(e.id).setAttrs({ x, y });
          findShape("shadow" + e.id).setAttrs({ x, y });
          findShape("group" + e.id).setAttrs({
            clipFunc: clipFuncHelper.group(
              { ...e, shapeX: x, shapeY: y },
              false
            ),
          });
        } else {
          shape.setAttrs({ x: e.x + dx, y: e.y + dy });
        }
      });
  };
  const rectOnDragEnd = (elements, xBase, yBase) => (e) => {
    if (lock) return;
    const dx = e.target.x() - xBase;
    const dy = e.target.y() - yBase;
    const move = (element) => {
      if (!multiSelectIds.has(element.id)) return element;
      if (element.type === "clippedImage") {
        return {
          ...element,
          shapeX: element.shapeX + dx,
          shapeY: element.shapeY + dy,
        };
      } else {
        return {
          ...element,
          x: element.x + dx,
          y: element.y + dy,
        };
      }
    };
    const newElements = elements.map(move);
    updateElements(newElements);
    updateRectProps(e.target, newElements);
  };

  const msProps = (() => {
    if (rectProps) {
      const rect = findShape("multiSelectRect");
      const dx = rect.x() - rectProps.x;
      const dy = rect.y() - rectProps.y;
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
        return {
          ...rectProps,
          x: rect.x(),
          y: rect.y(),
        };
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

  const msIncludes = (id) => multiSelectIds.has(id);
  const msAdd = (id) => {
    if (id === selected) return;
    const copy = new Set(multiSelectIds);
    if (selected) copy.add(selected);
    if (copy.size === 0) {
      setSelected(id);
    } else {
      copy.add(id);
      setMultiSelectIds(copy);
      setRectProps(null);
      if (selected) setSelected(null);
    }
  };
  const msAddAll = (ids) => {
    const copy = new Set(multiSelectIds);
    if (selected) copy.add(selected);
    ids.forEach((id) => {
      copy.add(id);
    });
    setMultiSelectIds(copy);
    setRectProps(null);
    if (selected) setSelected(null);
  };
  const msClear = () => {
    setMultiSelectIds(new Set());
    setRectProps(null);
  };
  const msDelete = (id) => {
    const copyIds = new Set(multiSelectIds);
    copyIds.delete(id);
    if (copyIds.size === 1) {
      const [id] = Array.from(copyIds);
      msClear();
      setSelected(id);
    } else {
      setMultiSelectIds(copyIds);
      setRectProps(null);
      if (selected) setSelected(null);
    }
  };
  const msDeleteAll = (ids) => {
    const copyIds = new Set(multiSelectIds);
    ids.forEach((id) => {
      copyIds.delete(id);
    });
    if (copyIds.size === 1) {
      const [id] = Array.from(copyIds);
      msClear();
      setSelected(id);
    } else {
      setMultiSelectIds(copyIds);
      setRectProps(null);
      if (selected) setSelected(null);
    }
  };
  const msClick = (element) => (e) => {
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
        setSelected(null);
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
  const msDragMove = (element) => (e) => {
    if (lock) return;
    const target = e.target;
    const dx = target.x() - (element.type === "clippedImage" ? 0 : element.x);
    const dy = target.y() - (element.type === "clippedImage" ? 0 : element.y);
    const move = (e) => {
      if (e.type === "clippedImage") {
        const clipFuncHelper = new ClipFuncHelper(e);
        const x = e.shapeX + dx;
        const y = e.shapeY + dy;
        findShape(e.id).setAttrs({ x, y });
        findShape("shadow" + e.id).setAttrs({ x, y });
        findShape("group" + e.id).setAttrs({
          clipFunc: clipFuncHelper.group({ ...e, shapeX: x, shapeY: y }, false),
        });
      } else {
        findShape(e.id).setAttrs({
          x: e.x + dx,
          y: e.y + dy,
        });
      }
    };
    if (!multiSelectIds.has(element.id)) {
      if (element.group) {
        element.group.map((id) => findElement(elements, id)).forEach(move);
      }
      return;
    }
    elements
      .filter((e) => multiSelectIds.has(e.id) && e.id !== element.id)
      .forEach(move);
    findShape("multiSelectRect").setAttrs({
      x: msProps.x + dx,
      y: msProps.y + dy,
    });
  };

  const msDragEnd = (element) => (e) => {
    if (lock) return;
    if (!msIncludes(element.id)) {
      if (element.group && element.group.length > 0) {
        const dx =
          e.target.x() - (element.type === "clippedImage" ? 0 : element.x);
        const dy =
          e.target.y() - (element.type === "clippedImage" ? 0 : element.y);
        updateElements(
          element.group.map((id) => {
            const e = findElement(elements, id);
            if (e.type === "clippedImage") {
              return {
                ...e,
                shapeX: e.shapeX + dx,
                shapeY: e.shapeY + dy,
              };
            } else {
              return {
                ...e,
                x: e.x + dx,
                y: e.y + dy,
              };
            }
          })
        );
        setMultiSelectIds(new Set(element.group));
        setSelected(null);
      } else {
        if (element.type === "clippedImage") {
          updateElement({
            id: element.id,
            shapeX: element.shapeX + e.target.x(),
            shapeY: element.shapeY + e.target.y(),
          });
        } else {
          updateElement({
            id: element.id,
            x: e.target.x(),
            y: e.target.y(),
          });
        }
        setSelected(element.id);
        msClear();
      }
      return;
    }

    const target = e.target;
    const dx = target.x() - (element.type === "clippedImage" ? 0 : element.x);
    const dy = target.y() - (element.type === "clippedImage" ? 0 : element.y);
    const move = (element) => {
      if (!multiSelectIds.has(element.id)) return element;
      if (element.type === "clippedImage") {
        return {
          ...element,
          shapeX: element.shapeX + dx,
          shapeY: element.shapeY + dy,
        };
      } else {
        return {
          ...element,
          x: element.x + dx,
          y: element.y + dy,
        };
      }
    };
    const newElements = elements.map(move);
    updateElements(newElements);
    updateRectProps(findShape("multiSelectRect"), newElements);
  };

  const msSelectionRectStart = (stage) => {
    const { x, y } = stage.getPointerPosition();
    findShape("selectionRect").setAttrs({
      x,
      y,
      width: 0,
      height: 0,
      visible: true,
    });
  };

  const msSelectionRectMove = (stage) => {
    const { x, y } = stage.getPointerPosition();
    const selection = findShape("selectionRect");
    const rx = selection.x();
    const ry = selection.y();
    findShape("selectionRect").setAttrs({ width: x - rx, height: y - ry });
  };

  const msSelectionRectEnd = () => {
    const rect = findShape("selectionRect");
    if (!rect.visible()) return;
    const x = rect.x();
    const y = rect.y();
    const width = rect.width();
    const height = rect.height();
    const left = Math.min(x, x + width);
    const right = Math.max(x, x + width);
    const top = Math.min(y, y + height);
    const bottom = Math.max(y, y + height);
    const isSelectedElement = (e) =>
      !e.lock && e.x > left && e.x < right && e.y > top && e.y < bottom;
    findShape("selectionRect").setAttrs({
      visible: false,
      width: 0,
      height: 0,
    });
    const selectedElements = elements.filter(isSelectedElement);
    const groupsIds = [];
    selectedElements.forEach((e) => {
      if (e.group) {
        groupsIds.push(...e.group);
      }
    });
    const ids = [
      ...new Set([...selectedElements.map((e) => e.id), ...groupsIds]),
    ];
    if (ids)
      if (ids.length === 1) {
        setSelected(ids[0]);
      } else {
        setMultiSelectIds(new Set(ids));
        setRectProps(null);
        if (selected) setSelected(null);
      }
  };

  const msDraggable = (id) => !msIncludes(id) || !lock;

  const msMouseDown = (element) => () => {
    if (!element || element.lock) {
      msSelectionRectStart(stage);
      setMultiSelectIds(new Set());
    }
  };

  const isGrouped = () => {
    const getElementGroup = (id) => {
      const element = findElement(elements, id);
      return (element && element.group) || [];
    };
    const equal = (xs, ys) =>
      xs.length === ys.length && xs.every((x, i) => x === ys[i]);
    const allEqual = (list) => list.reduce((a, b) => (equal(a, b) ? a : NaN));
    const groups = [...multiSelectIds].map(getElementGroup);
    return groups.length > 0 && allEqual(groups) && groups[0].length > 0;
  };

  const msGroupClick = () => {
    const group = isGrouped() ? [] : [...multiSelectIds];
    const updateGroup = (e) => {
      if (!multiSelectIds.has(e.id)) return e;
      return {
        ...e,
        group,
      };
    };
    updateElements(elements.map(updateGroup));
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

function getMultiSelectProps(elements, multiSelectIds, findShape) {
  const allVertices = elements
    .filter((e) => multiSelectIds.has(e.id))
    .map((e) => vertices(e, findShape))
    .flat();
  const xs = allVertices.map((v) => v.x);
  const ys = allVertices.map((v) => v.y);
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

function vertices(element, findShape) {
  const { id, scaleX, scaleY, type } = element;
  const rotation = element.rotation ?? 0;
  const cos = Math.cos((rotation / 180) * Math.PI);
  const sin = Math.sin((rotation / 180) * Math.PI);

  let x, y, width, height;
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
  } else {
    width = element.width * scaleX;
    height = element.height * scaleY;
    x = element.x;
    y = element.y;
  }
  const absXY = (dx, dy) => ({
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

export function alignMultiSelect(
  stage,
  align,
  elements,
  updateElements,
  multiSelectIds
) {
  const rect = stage ? stage.find(`#multiSelectRect`)[0] : undefined;
  if (!rect) return { stage, dx: 0, dy: 0 };
  const x = rect.x();
  const y = rect.y();
  const scaleX = rect.scaleX();
  const scaleY = rect.scaleY();
  const width = rect.width() * scaleX;
  const height = rect.height() * scaleY;
  const rotation = rect.rotation();
  const cos = Math.cos((rotation / 180) * Math.PI);
  const sin = Math.sin((rotation / 180) * Math.PI);
  const absXY = (dx, dy) => ({
    x: x + dx * cos - dy * sin,
    y: y + dx * sin + dy * cos,
  });
  const widthHalf = width / 2;
  const heightHalf = height / 2;
  const vertices = [
    absXY(-widthHalf, -heightHalf),
    absXY(widthHalf, -heightHalf),
    absXY(widthHalf, heightHalf),
    absXY(-widthHalf, heightHalf),
  ];
  const xs = vertices.map((v) => v.x);
  const ys = vertices.map((v) => v.y);
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
    elements.map((e) => {
      if (!multiSelectIds.has(e.id)) return e;
      if (e.type === "clippedImage") {
        return {
          ...e,
          shapeX: e.shapeX + dx,
          shapeY: e.shapeY + dy,
        };
      } else {
        return {
          ...e,
          x: (e.x ?? 0) + dx,
          y: (e.y ?? 0) + dy,
        };
      }
    })
  );
}

export function alignMultiSelect2(
  stage,
  align,
  elements,
  updateElements,
  multiSelectIds
) {
  const multiSelected = (e) => multiSelectIds.has(e.id);
  if (align === "middle" || align === "center") {
    const cx = stage.width() / 2;
    const cy = stage.height() / 2;
    updateElements(
      elements.map((e, i) => {
        if (!multiSelected(e)) return e;
        if (align === "middle") {
          return e.type === "clippedImage"
            ? { ...e, shapeX: cx }
            : { ...e, x: cx };
        }
        if (align === "center") {
          return e.type === "clippedImage"
            ? { ...e, shapeY: cy }
            : { ...e, y: cy };
        }
        return e;
      })
    );
    return;
  }

  const findShape = (id) => stage.find(`#${id}`)[0];
  const allVertices = elements.map((e) =>
    multiSelected(e) ? vertices(e, findShape) : null
  );
  const flatVertices = allVertices.filter((v) => v).flat();
  const getTop = (vertices) => Math.min(...vertices.map((v) => v.y));
  const getBottom = (vertices) => Math.max(...vertices.map((v) => v.y));
  const getLeft = (vertices) => Math.min(...vertices.map((v) => v.x));
  const getRight = (vertices) => Math.max(...vertices.map((v) => v.x));

  const func = {
    top: getTop,
    bottom: getBottom,
    left: getLeft,
    right: getRight,
  }[align];

  const target = func(flatVertices);
  updateElements(
    elements.map((e, i) => {
      if (!multiSelected(e)) return e;
      const vs = allVertices[i];
      const dy = align === "top" || align === "bottom" ? target - func(vs) : 0;
      const dx = align === "left" || align === "right" ? target - func(vs) : 0;
      return e.type === "clippedImage"
        ? { ...e, shapeX: e.shapeX + dx, shapeY: e.shapeY + dy }
        : { ...e, x: e.x + dx, y: e.y + dy };
    })
  );
}
