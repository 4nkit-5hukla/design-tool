import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { ShapesHistory } from "Interfaces";
import { useAppState } from "./AppState";

interface IHistoryContext {
  history: ShapesHistory[];
  index: number;
  canRedo: boolean;
  canUndo: boolean;
  redo: () => void;
  undo: () => void;
  saveHistory: (state: ShapesHistory) => void;
}

const HistoryContext = createContext<IHistoryContext>({
  history: [],
  index: 0,
  canRedo: false,
  canUndo: false,
  redo: () => {},
  undo: () => {},
  saveHistory: (_state: ShapesHistory) => {},
});

const History = ({ children }: { children: ReactNode }) => {
  const { Provider: HistoryProvider } = HistoryContext;
  const [history, setHistory] = useState<ShapesHistory[]>([[]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const { setMultiSelectIds, stageRef } = useAppState();
  const saveHistory = (state: ShapesHistory) => {
    setHistory([...history.slice(0, historyIndex + 1), state]);

    setHistoryIndex(historyIndex + 1);
  };
  const canUndo = useMemo(
    () => history.length > 0 && historyIndex > 0,
    [history, historyIndex]
  );
  const canRedo = useMemo(
    () => history.length > 0 && historyIndex < history.length - 1,
    [history, historyIndex]
  );

  const fixTextShapes = (nextIndex: number) => {
    history[historyIndex].forEach((element, i) => {
      if (element.type !== "text") return;
      const next = history[nextIndex][i];
      const scale = next.fontSize / element.fontSize;
      const shape = stageRef.current.find(`#${element.id}`)[0];
      shape.setAttrs({
        width: shape.width() * scale,
        height: shape.height() * scale,
      });
    });
  };
  const undo = () => {
    if (!canUndo || historyIndex === 0) return;
    fixTextShapes(historyIndex - 1);
    setMultiSelectIds(new Set());
    setHistoryIndex(historyIndex - 1);
  };
  const redo = () => {
    if (!canRedo || historyIndex === history.length - 1) return;
    fixTextShapes(historyIndex + 1);
    setMultiSelectIds(new Set());
    setHistoryIndex(historyIndex + 1);
  };

  // providerValue
  const providerValue: IHistoryContext = {
    history,
    index: historyIndex,
    canRedo,
    canUndo,
    redo,
    undo,
    saveHistory,
  };

  return <HistoryProvider value={providerValue}>{children}</HistoryProvider>;
};

export const useHistory = () => {
  const context = useContext(HistoryContext);

  if (!context)
    throw new Error("useHistory must be called from within the History");

  return context;
};

export default History;
