import { createContext, ReactNode, useContext, useRef, useCallback, useEffect } from "react";
import useUndo from "use-undo";
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
  const [historyState, { set: setHistory, undo: undoHistory, redo: redoHistory, canUndo, canRedo }] = useUndo<ShapesHistory>([]);
  const { setMultiSelectIds, stageRef } = useAppState();
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<ShapesHistory | null>(null);

  const flushPendingHistory = useCallback((): ShapesHistory | null => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    const flushedState = pendingStateRef.current;
    if (flushedState) {
      setHistory(flushedState);
      pendingStateRef.current = null;
    }
    return flushedState;
  }, [setHistory]);

  const saveHistory = useCallback((state: ShapesHistory) => {
    pendingStateRef.current = state;
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      if (pendingStateRef.current) {
        setHistory(pendingStateRef.current);
        pendingStateRef.current = null;
      }
      debounceTimerRef.current = null;
    }, 300);
  }, [setHistory]);

  const fixTextShapes = (currentState: ShapesHistory, nextState: ShapesHistory) => {
    currentState.forEach((element, i) => {
      if (element.type !== "text") return;
      const next = nextState[i];
      if (!next || next.type !== "text") return;
      const scale = next.fontSize / element.fontSize;
      const shape = stageRef.current?.find(`#${element.id}`)?.[0];
      if (shape) {
        shape.setAttrs({
          width: shape.width() * scale,
          height: shape.height() * scale,
        });
      }
    });
  };

  const undo = () => {
    if (!canUndo) return;
    const flushedState = flushPendingHistory();
    const currentState = flushedState ?? historyState.present;
    const nextState = flushedState ? historyState.present : historyState.past[historyState.past.length - 1];
    if (nextState) {
      fixTextShapes(currentState, nextState);
    }
    setMultiSelectIds(new Set());
    undoHistory();
  };

  const redo = () => {
    if (!canRedo) return;
    const flushedState = flushPendingHistory();
    if (!flushedState) {
      const currentState = historyState.present;
      const nextState = historyState.future[0];
      if (nextState) {
        fixTextShapes(currentState, nextState);
      }
    }
    setMultiSelectIds(new Set());
    redoHistory();
  };

  useEffect(() => {
    return () => {
      flushPendingHistory();
    };
  }, [flushPendingHistory]);

  // providerValue
  const providerValue: IHistoryContext = {
    history: [
      ...historyState.past,
      historyState.present,
      ...historyState.future,
    ],
    index: historyState.past.length,
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
