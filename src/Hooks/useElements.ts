/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import { useId } from "Hooks";
// import svgpath from "svgpath";
// import { triangle, star } from "Assets/Shapes";

import { useHistory } from "Contexts/History";
import { useAppState } from "Contexts/AppState";
import { CanvasElement } from "Interfaces/Elements";

export const useElements = () => {
  const { canvas, multiSelectIds } = useAppState();
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [copiedEl, setCopiedEl] = useState<CanvasElement>();

  const { generateId } = useId();

  const { saveHistory, history, index: historyIndex } = useHistory();

  const getElementById = (id: string) => elements.find((element) => element.id === id);

  const updateElement = <T extends Partial<CanvasElement>>(
    config: T & { id: string },
    options: {
      saveHistory?: boolean;
    } = {
      saveHistory: true,
    }
  ) => {
    const updated = elements.map((element) => {
      if (element.id === config.id) {
        return {
          ...element,
          ...config,
        };
      }
      return element;
    });

    setElements(updated);

    if (options.saveHistory) {
      saveHistory(updated);
    }

    return updated;
  };

  const updateElements = <T extends Partial<CanvasElement>>(
    configs: T[],
    options: {
      saveHistory?: boolean;
    } = {
      saveHistory: true,
    }
  ) => {
    const updated = elements.map((element) => {
      const config = configs.find((c) => c.id === element.id);
      if (config) {
        return {
          ...element,
          ...config,
        };
      }
      return element;
    });
    setElements(updated);
    if (options.saveHistory) {
      saveHistory(updated);
    }
    return updated;
  };

  const generateElement = <T extends Partial<CanvasElement>>(element: T) => {
    if ("filters" in element) {
      delete (element as any).filters;
    }

    const defaultColor = "#649BB8";
    let created: any = {
      id: element.id ?? generateId(),
      draggable: true,
      lock: false,
      shadowBlur: 0,
      brightness: 0,
      blurRadius: 0,
      enhance: 0,
      rgb: false,
      red: 128,
      green: 128,
      blue: 128,
      saturation: 0,
      contrast: 0,
      pixelSize: 1,
      opacity: 1,
      fill: defaultColor,
    };
    const elHeight = (element as any).height ?? 100;
    const elWidth = (element as any).width ?? 100;

    switch (element.type) {
      case "flat-svg":
        created = {
          ...created,
          ...element,
          colors: JSON.stringify((element as any).data)
            .match(/#[0-9a-fA-F]{8}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/gm)
            ?.filter((color, index, allColors) => allColors.indexOf(color) === index),
          type: "flat-svg",
          scaleX: 1,
          scaleY: 1,
          scaled: { status: false, scaleX: 1, scaleY: 1 },
          height: elHeight,
          width: elWidth,
          y: element.y ?? Math.abs(Math.random() * (canvas.height - elHeight)) + elHeight,
          x: element.x ?? Math.abs(Math.random() * (canvas.width - elWidth)) + elWidth,
          fill: undefined,
        };
        break;
      case "path":
        created = {
          ...created,
          ...element,
          type: "path",
          scaleX: 1,
          scaleY: 1,
          scaled: { status: false, scaleX: 1, scaleY: 1 },
          height: elHeight,
          width: elWidth,
          y: element.y ?? Math.abs(Math.random() * (canvas.height - elHeight)) + elHeight,
          x: element.x ?? Math.abs(Math.random() * (canvas.width - elWidth)) + elWidth,
          fill: element.fill ?? defaultColor,
          stroke: "#000000",
          strokeWidth: 0,
          strokeType: "solid",
          shadowColor: "#000000",
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowOpacity: 1,
          shadowEnabled: false,
          useAnchors: element.useAnchors,
        };
        break;
      case "circle":
      case "ellipse":
        created = {
          ...created,
          ...element,
          type: "ellipse",
          y: element.y ?? Math.abs(Math.random() * canvas.height - 100),
          x: element.x ?? Math.abs(Math.random() * canvas.width - 100),
          rotation: element.rotation ?? 0,
          radiusX: element.radiusX ?? 50,
          radiusY: element.radiusY ?? 50,
          fill: element.fill ?? defaultColor,
        };
        break;
      case "rectangle":
        created = {
          ...created,
          ...element,
          type: "rectangle",
          y: element.y ?? Math.abs(Math.random() * canvas.height - 100),
          x: element.x ?? Math.abs(Math.random() * canvas.width - 100),
          width: element.width ?? 100,
          height: element.height ?? 100,
          fill: element.fill ?? defaultColor,
        };
        break;
      case "text":
        created = {
          ...created,
          ...element,
          type: "text",
          rotation: element.rotation ?? 0,
          y: element.y ?? Math.random() * 100,
          x: element.x ?? Math.random() * 100,
          scaleX: 1,
          scaleY: 1,
          fill: element.fill ?? defaultColor,
          text: element.text ?? "Double click to edit",
          fontSize: element.fontSize ?? 28,
          fontStyle: element.fontStyle ?? "normal",
          textDecoration: "",
          verticalAlign: "middle",
          useList: false,
          listType: "", // "" or "ul" or "ol"
          align: element.align ?? "left",
          wrap: (element as any).wrap ?? "word",
        };
        break;
      case "image":
        const { image, x, y, width, height } = element;
        created = {
          ...created,
          ...element,
          scaleX: 1,
          scaleY: 1,
          strokeEnabled: false,
          stroke: "#000000",
          strokeWidth: 2,
          shadowColor: "#000000",
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowOpacity: 1,
          shadowEnabled: false,
          fill: undefined,
          image,
          x,
          y,
          width,
          height,
          innerOffsetX: (width as number) / 4,
          innerOffsetY: (height as number) / 4,
          innerWidth: (width as number) / 2,
          innerHeight: (height as number) / 2,
          flip: false,
          rotation: 0,
        };
        break;
      case "clippedImage":
        created = {
          ...created,
          ...element,
        };
        break;
      default:
        break;
    }

    return created;
  };

  const addElement = <T extends CanvasElement>(element: T | T[]) => {
    const created = (Array.isArray(element) ? element : [element]).map((option) => generateElement(option)) as CanvasElement[];

    setElements(elements.concat(created));

    saveHistory(elements.concat(created));

    return created;
  };

  useEffect(() => {
    setElements(history[historyIndex]);
  }, [historyIndex]);

  const moveSelected = (from: number, to: number) => {
    const newElements = [...elements];
    const item = newElements.splice(from, 1)[0];
    newElements.splice(to, 0, item);
    return newElements;
  };

  const multiSelected = (e: CanvasElement) => (e.id ? multiSelectIds.has(e.id) : false);
  const notMultiSelected = (e: CanvasElement) => !(e.id ? multiSelectIds.has(e.id) : false);

  const msPositions = () => {
    const firstSelectedIndex = elements.findIndex(multiSelected);
    const lastSelectedIndex = elements.length - 1 - [...elements].reverse().findIndex(multiSelected);
    return {
      firstSelectedIndex,
      lastSelectedIndex,
      rest: elements.filter(notMultiSelected),
      selected: elements.filter(multiSelected),
    };
  };

  const toFront = (id: string) => {
    if (multiSelectIds.size > 0) {
      const { selected, rest } = msPositions();
      const result = [...rest, ...selected];
      setElements(result);
      saveHistory(result);
      return;
    }

    const element = elements.find((item) => item.id === id);
    if (!element) return;
    const result = elements.filter((item) => item.id !== id).concat([element]);
    setElements(result);
    saveHistory(result);
  };

  const toForward = (id: string) => {
    if (multiSelectIds.size > 0) {
      const { selected, firstSelectedIndex } = msPositions();
      const moved = elements
        .filter((_, i) => i > firstSelectedIndex)
        .filter(notMultiSelected)
        .pop();
      if (!moved) return;
      const movedIndex = elements.findIndex((e) => e.id === moved.id);
      const result = [
        ...elements.slice(0, movedIndex).filter(notMultiSelected),
        moved,
        ...selected,
        ...elements.slice(movedIndex + 1).filter(notMultiSelected),
      ];
      setElements(result);
      saveHistory(result);
      return;
    }

    const selectedIndex = elements.findIndex((element) => element.id === id);
    if (selectedIndex < 0) return;
    if (selectedIndex < elements.length - 1) {
      const result = moveSelected(selectedIndex, selectedIndex + 1);
      setElements(result);
      saveHistory(result);
    }
  };

  const toBack = (id: string) => {
    if (multiSelectIds.size > 0) {
      const { selected, rest } = msPositions();
      const result = [...selected, ...rest];
      setElements(result);
      saveHistory(result);
      return;
    }

    const element = elements.find((item) => item.id === id);
    if (!element) return;
    const result = [element].concat(elements.filter((item) => item.id !== id));
    setElements(result);
    saveHistory(result);
  };

  const toBackward = (id: string) => {
    if (multiSelectIds.size > 0) {
      const { selected, lastSelectedIndex } = msPositions();
      const moved = elements
        .filter((_, i) => i < lastSelectedIndex)
        .filter(notMultiSelected)
        .pop();
      if (!moved) return;
      const movedIndex = elements.findIndex((e) => e.id === moved.id);
      const result = [
        ...elements.slice(0, movedIndex).filter(notMultiSelected),
        ...selected,
        moved,
        ...elements.slice(movedIndex + 1).filter(notMultiSelected),
      ];
      setElements(result);
      saveHistory(result);
      return;
    }

    const selectedIndex = elements.findIndex((element) => element.id === id);
    if (selectedIndex > 0) {
      const result = moveSelected(selectedIndex, selectedIndex - 1);
      setElements(result);
      saveHistory(result);
    }
  };

  const removeElement = (id: string) => {
    const element = elements.find((item) => item.id === id);
    if (!element) return;
    const result = elements.filter((item) => item.id !== id);
    setElements(result);
    saveHistory(result);
  };

  const duplicateElement = (id: string, avgMoveUnit: number): CanvasElement => {
    const element = elements.find((item) => item.id === id);
    if (!element) return {} as CanvasElement;
    
    let created: CanvasElement;
    if (element.type === "clippedImage") {
      created = {
        ...element,
        id: generateId(),
        shapeX: element.shapeX + avgMoveUnit,
        shapeY: element.shapeY + avgMoveUnit,
      };
    } else {
      created = {
        ...element,
        id: generateId(),
        x: ((element as any).x ?? 0) + avgMoveUnit,
        y: ((element as any).y ?? 0) + avgMoveUnit,
      } as CanvasElement;
    }
    const result = elements.concat([created]);
    setElements(result);
    saveHistory(result);
    return created;
  };

  const copyElement = (id: string, avgMoveUnit: number) => {
    const element = elements.find((item) => item.id === id);
    if (!element) return;
    
    if (element.type === "clippedImage") {
      setCopiedEl({
        ...element,
        id: generateId(),
        shapeX: (element as any).shapeX + avgMoveUnit,
        shapeY: (element as any).shapeY + avgMoveUnit,
      } as CanvasElement);
      return;
    }
    setCopiedEl({
      ...element,
      id: generateId(),
      x: (element.x ?? 0) + avgMoveUnit,
      y: (element.y ?? 0) + avgMoveUnit,
    });
  };

  const pasteElement = (): CanvasElement | void => {
    if (copiedEl) {
      const result = elements.concat([copiedEl]);
      setElements(result);
      saveHistory(result);
      if (copiedEl.type === "clippedImage") {
        setCopiedEl({
          ...copiedEl,
          id: generateId(),
          shapeX: copiedEl.shapeX + 10,
          shapeY: copiedEl.shapeY + 10,
        });
        return copiedEl;
      }
      copiedEl &&
        copiedEl.x &&
        copiedEl.y &&
        setCopiedEl({
          ...copiedEl,
          id: generateId(),
          x: copiedEl.x + 10,
          y: copiedEl.y + 10,
        });
      return copiedEl;
    }
  };

  return {
    elements,

    getElementById,
    duplicateElement,
    copyElement,
    pasteElement,

    setElements,
    updateElement,
    updateElements,
    addElement,
    removeElement,

    toFront,
    toForward,
    toBack,
    toBackward,
  };
};
