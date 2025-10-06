import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Konva from "konva";

import { useAppState } from "./AppState";
import { useHistory } from "./History";

import { useDraggable, useEventListener, useElements, useFocusable, useZoom, useStage, useTool } from "Hooks";

import { alignMultiSelect2 } from "Hooks/useMultiSelect";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import { CanvasElement } from "Interfaces/Elements";

interface IElementsContext {
  elements: CanvasElement[];
  setElements: (elements: CanvasElement[]) => void;
  selectedEl: CanvasElement | null | undefined;
  selected: null | string;
  focused: null | string;
  draggable: boolean;
  getElementById: (id: string) => CanvasElement | undefined;
  setDraggable: (draggable: boolean) => void;
  updateElement: <T extends Partial<CanvasElement>>(
    config: T & { id: string },
    options?: { saveHistory?: boolean }
  ) => CanvasElement[];
  updateElements: <T extends Partial<CanvasElement>>(config: T[], options?: { saveHistory?: boolean }) => CanvasElement[];
  addElement: <T extends CanvasElement>(shape: T | T[]) => CanvasElement[];
  duplicateElement: (id: string, avgMoveUnit: number) => CanvasElement;
  designColors: string[] | undefined;
  designFonts: string[];
  removeElement: (id: string) => void;
  onDragStart: (e: Konva.KonvaEventObject<DragEvent>, shape: CanvasElement) => void;
  onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  unSelect: () => void;
  unFocus: () => void;
  setSelected: (id: string) => void;
  setFocused: (id: string) => void;
  toFront: (id: string) => void;
  toForward: (id: string) => void;
  toBack: (id: string) => void;
  toBackward: (id: string) => void;
  loadingTemplate: boolean;
  setLoadingTemplate: Dispatch<SetStateAction<boolean>>;
  templateImage: string;
  setTemplateImage: Dispatch<SetStateAction<string>>;

  zoom: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  stageX: number;
  setStageX: (x: number) => void;
  stageY: number;
  setStageY: (y: number) => void;

  stage: Konva.Stage | undefined;
  setStage: (stage: Konva.Stage | undefined) => void;
  layer: Konva.Layer | undefined;
  setLayer: (layer: Konva.Layer | undefined) => void;
  usingTool: boolean;
  toggleUsingTool: Dispatch<SetStateAction<boolean>>;
}

const defaultValue = {
  elements: [],
  setElements: () => {},
  selectedEl: null,
  selected: null,
  focused: null,
  updateElement: () => [],
  updateElements: () => [],
  designColors: undefined,
  designFonts: [],
  addElement: () => [],
  removeElement: () => {},
  duplicateElement: () => {
    return {} as CanvasElement;
  },
  onDragStart: () => {},
  onDragMove: () => {},
  onDragEnd: () => {},
  unSelect: () => {},
  unFocus: () => {},
  setSelected: () => {},
  setFocused: () => {},
  draggable: false,
  setDraggable: () => {},
  getElementById: () => undefined,
  toFront: () => {},
  toForward: () => {},
  toBack: () => {},
  toBackward: () => {},
  loadingTemplate: false,
  setLoadingTemplate: () => {},
  templateImage: "",
  setTemplateImage: () => {},

  zoom: 5,
  canZoomIn: true,
  canZoomOut: true,
  zoomIn: () => {},
  zoomOut: () => {},
  setZoom: () => {},
  stageX: 0,
  setStageX: () => {},
  stageY: 0,
  setStageY: () => {},

  setModeToEraser: () => {},
  setModeToPen: () => {},
  drawing: false,
  mode: "pen",
  setDrawing: () => {},
  willDrawing: false,
  setWillDrawing: () => {},
  onDrawStart: () => {},
  onDrawing: () => {},
  onDrawEnd: () => {},
  points: [],

  stage: undefined,
  setStage: () => {},
  layer: undefined,
  setLayer: () => {},
  usingTool: false,
  toggleUsingTool: () => {},
};

const ElementsContext = createContext<IElementsContext>(defaultValue);

const Elements = ({ children }: { children: ReactNode }) => {
  const { editText, editingData, avgMoveUnit, multiSelectIds, setMultiSelectIds, canvas } = useAppState();
  const { Provider: ElementsProvider } = ElementsContext;
  const [loadingTemplate, setLoadingTemplate] = useState<boolean>(false);
  const [templateImage, setTemplateImage] = useState<string>("");
  const [designColors, setDesignColors] = useState<string[] | undefined>(undefined);
  const [designFonts, setDesignFonts] = useState<string[]>([]);
  const { canRedo, canUndo, redo, undo } = useHistory();
  const {
    elements,
    setElements,
    updateElement,
    updateElements,
    addElement,
    removeElement,
    duplicateElement,
    copyElement,
    pasteElement,
    toFront,
    toForward,
    toBack,
    toBackward,
    getElementById,
  } = useElements();

  const { selected, onDragStart, onDragMove, onDragEnd, unSelect, setSelected, draggable, setDraggable } = useDraggable(
    {
      updateElement,
    }
  );

  const { focused, setFocused, unFocus } = useFocusable();

  const { zoom, canZoomIn, canZoomOut, zoomIn, zoomOut, setZoom, stageX, setStageX, stageY, setStageY } = useZoom({
    origin: { x: canvas.width / 2, y: canvas.height / 2 },
  });

  const { usingTool, toggleUsingTool } = useTool();

  const { stage, setStage, layer, setLayer } = useStage();

  const selectedEl = selected ? getElementById(selected) : null;

  // providerValue
  const providerValue: IElementsContext = {
    elements,
    setElements,
    selected,
    selectedEl,
    focused,
    setFocused,
    updateElement,
    updateElements,
    addElement,
    removeElement,
    duplicateElement,
    designColors,
    designFonts,
    onDragStart,
    onDragMove,
    onDragEnd,
    draggable,
    setDraggable,
    unSelect,
    unFocus,
    setSelected,
    getElementById,
    toFront,
    toForward,
    toBack,
    toBackward,
    loadingTemplate,
    setLoadingTemplate,
    templateImage,
    setTemplateImage,
    zoom,
    canZoomIn,
    canZoomOut,
    zoomIn,
    zoomOut,
    setZoom,
    stageX,
    setStageX,
    stageY,
    setStageY,
    stage,
    setStage,
    layer,
    setLayer,
    usingTool,
    toggleUsingTool,
  };

  useEffect(() => {
    if (elements.length > 0) {
      setDesignColors(
        JSON.stringify(elements)
          .match(/#[0-9a-fA-F]{8}|#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/gm)
          ?.filter((color, index, allColors) => allColors.indexOf(color) === index)
          .sort()
      );
      setDesignFonts(
        elements
          .filter((element) => element.type === "text")
          .map((element) => element.fontFamily)
          .filter((font, index, allFonts) => allFonts.indexOf(font) === index)
          .sort()
      );
    }
  }, [elements]);

  useEventListener("keydown", (event: KeyboardEvent) => {
    const { key, ctrlKey, shiftKey, metaKey } = event;
    switch (key.toUpperCase()) {
      case "Z":
        return shiftKey ? (ctrlKey || metaKey) && canRedo && redo() : (ctrlKey || metaKey) && canUndo && undo();
      case "Y":
        return (ctrlKey || metaKey) && canRedo && redo();
      case "V":
        if (ctrlKey || metaKey) {
          event.preventDefault();
          const element = pasteElement();
          if (element && element.id) {
            setSelected(element.id);
          }
        }
        break;
      case "L":
        if ((ctrlKey || metaKey) && selected && selectedEl) {
          event.preventDefault();
          updateElement({
            id: selected,
            lock: !selectedEl.lock,
          });
        }
        break;
      default:
    }
    if (!usingTool && selectedEl) {
      if (selectedEl && selectedEl.type === "text" && editText) {
        return;
      }
      if (!selectedEl.lock && !editingData) {
        const moveDistance = shiftKey ? avgMoveUnit / 2 : 1;
        switch (key.toUpperCase()) {
          case "ArrowUp".toUpperCase():
            event.preventDefault();
            if (selected && selectedEl) {
              if (selectedEl.type === "clippedImage") {
                updateElement({
                  id: selected,
                  shapeY: selectedEl.shapeY - moveDistance,
                } as any);
              } else {
                updateElement({
                  id: selected,
                  y: ((selectedEl as any).y ?? 0) - moveDistance,
                } as any);
              }
            }
            break;
          case "ArrowDown".toUpperCase():
            event.preventDefault();
            if (selected && selectedEl) {
              if (selectedEl.type === "clippedImage") {
                updateElement({
                  id: selected,
                  shapeY: selectedEl.shapeY + moveDistance,
                } as any);
              } else {
                updateElement({
                  id: selected,
                  y: ((selectedEl as any).y ?? 0) + moveDistance,
                } as any);
              }
            }
            break;
          case "ArrowLeft".toUpperCase():
            event.preventDefault();
            if (selected && selectedEl) {
              if (selectedEl.type === "clippedImage") {
                updateElement({
                  id: selected,
                  shapeX: selectedEl.shapeX - moveDistance,
                } as any);
              } else {
                updateElement({
                  id: selected,
                  x: ((selectedEl as any).x ?? 0) - moveDistance,
                } as any);
              }
            }
            break;
          case "ArrowRight".toUpperCase():
            event.preventDefault();
            if (selected && selectedEl) {
              if (selectedEl.type === "clippedImage") {
                updateElement({
                  id: selected,
                  shapeX: selectedEl.shapeX + moveDistance,
                } as any);
              } else {
                updateElement({
                  id: selected,
                  x: ((selectedEl as any).x ?? 0) + moveDistance,
                } as any);
              }
            }
            break;
          case "Delete".toUpperCase():
            event.preventDefault();
            if (selected) {
              removeElement(selected);
              unSelect();
              unFocus();
            }
            break;
          case "Backspace".toUpperCase():
            event.preventDefault();
            if (navigator.userAgent.includes("Mac") && selected) {
              removeElement(selected);
              unSelect();
              unFocus();
            }
            break;
          case "c".toUpperCase():
            event.preventDefault();
            if ((ctrlKey || metaKey) && selected) {
              copyElement(selected, avgMoveUnit);
            }
            break;
          case "d".toUpperCase():
            event.preventDefault();
            if ((ctrlKey || metaKey) && selected) {
              const element = duplicateElement(selected, avgMoveUnit);
              if (element.id) {
                setSelected(element.id as string);
              }
            }
            break;
          case "[":
            event.preventDefault();
            if (selected) {
              return ctrlKey || metaKey ? toBack(selected) : toBackward(selected);
            }
            break;
          case "]":
            event.preventDefault();
            if (selected) {
              return ctrlKey || metaKey ? toFront(selected) : toForward(selected);
            }
            break;
          default:
        }
      }
    }
    if (multiSelectIds.size > 0 && !editingData) {
      event.preventDefault();
      const moveDistance = shiftKey ? avgMoveUnit / 2 : 1;

      const del = () => {
        setElements(elements.filter((e) => (e.id ? !multiSelectIds.has(e.id) : false)));
        setMultiSelectIds(new Set());
      };
      const rect = stage ? stage.find(`#multiSelectRect`)[0] : undefined;
      const move = (dx: number, dy: number) => {
        if (!rect) return;
        rect.setAttrs({ x: rect.x() + dx, y: rect.y() + dy });
        setElements(
          elements.map((e) => {
            const lookCondition = e.id ? !multiSelectIds.has(e.id) : false;
            if (lookCondition) return e;
            if (e.type === "clippedImage") {
              return {
                ...e,
                shapeX: e.shapeX + dx,
                shapeY: e.shapeY + dy,
              };
            }
            return {
              ...e,
              x: ((e as any).x ?? 0) + dx,
              y: ((e as any).y ?? 0) + dy,
            } as CanvasElement;
          })
        );
      };
      const align2 = (align: string) => {
        if (!stage) return;
        alignMultiSelect2(stage, align as any, elements, setElements, multiSelectIds);
        setMultiSelectIds(new Set());
        setTimeout(() => {
          setMultiSelectIds(new Set(multiSelectIds));
        }, 300);
      };
      const groupUngroup = () => {
        const isGrouped = () => {
          const findElement = (elements: CanvasElement[], id: string): CanvasElement | undefined =>
            elements.find((e) => e.id === id);
          const getElementGroup = (id: string) => {
            const element = findElement(elements, id);
            return (element as any)?.group || [];
          };
          const equal = (xs: number[], ys: number[]) => xs.length === ys.length && xs.every((x, i) => x === ys[i]);
          const allEqual = (list: any[]) => list.reduce((a, b) => (equal(a, b) ? a : NaN));
          const groups = [...multiSelectIds].map(getElementGroup);
          return groups.length > 0 && allEqual(groups) && groups[0].length > 0;
        };

        const group = isGrouped() ? [] : [...multiSelectIds];
        const updateGroup = (e: CanvasElement) => {
          const lookCondition = e.id ? !multiSelectIds.has(e.id) : false;
          if (lookCondition) return e;
          return {
            ...e,
            group,
          } as CanvasElement;
        };
        setElements(elements.map(updateGroup));
      };
      switch (key.toUpperCase()) {
        case "ArrowUp".toUpperCase():
          move(0, -moveDistance);
          break;
        case "ArrowDown".toUpperCase():
          move(0, +moveDistance);
          break;
        case "ArrowLeft".toUpperCase():
          move(-moveDistance, 0);
          break;
        case "ArrowRight".toUpperCase():
          move(+moveDistance, 0);
          break;
        case "Delete".toUpperCase():
          del();
          break;
        case "Backspace".toUpperCase():
          if (navigator.userAgent.includes("Mac")) {
            del();
          }
          break;
        case "[":
          if (selected) {
            if (ctrlKey || metaKey) {
              toBack(selected);
            } else {
              toBackward(selected);
            }
          }
          break;
        case "]":
          if (selected) {
            if (ctrlKey || metaKey) {
              toFront(selected);
            } else {
              toForward(selected);
            }
          }
          break;
        case "T":
          align2("top");
          break;
        case "B":
          align2("bottom");
          break;
        case "V":
          align2("middle");
          break;
        case "L":
          align2("left");
          break;
        case "R":
          align2("right");
          break;
        case "H":
          align2("center");
          break;
        case "G":
          if (ctrlKey || metaKey) groupUngroup();
          break;
        default:
      }
    }
  });

  useEventListener("message", (event: MessageEvent) => {
    const parent = event.source ?? null;
    // now we can do whatever we want with the message data.
    // in this case, displaying it, and then sending it back
    // wrapped in an object
    if (event.data.length > 0) {
      setElements(event.data);
      setTimeout(() => {
        if (!layer) return;
        const base64 = layer.toDataURL({
          pixelRatio: 2,
          width: canvas.width,
          height: canvas.height,
          mimeType: "image/png",
          quality: 1,
        });
        const response = {
          success: true,
          request: { base64 },
        };
        if (parent) {
          parent.postMessage(response, { targetOrigin: "*" } as WindowPostMessageOptions);
        }
      }, 200);
    }
  });

  return <ElementsProvider value={providerValue}>{children}</ElementsProvider>;
};

export const useElementsContext = () => {
  const context = useContext(ElementsContext);

  if (!context) throw Error("useElementsContext must be called from within the Elements");

  return context;
};

export default Elements;
