import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useHistory as useOldHistory } from '../../Contexts/History';
import { useAppState } from '../../Contexts/AppState';
import { CanvasElement } from '../../types';
import { CanvasElement as OldCanvasElement } from '../../Interfaces/Elements';

interface HistoryContextType {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveToHistory: (elements: CanvasElement[], selectedIds: string[]) => void;
  clear: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryAdapter: React.FC<{ children: ReactNode }> = ({ children }) => {
  const oldHistory = useOldHistory();
  const { setMultiSelectIds } = useAppState();

  const saveToHistory = useCallback((elements: CanvasElement[], selectedIds: string[]) => {
    oldHistory.saveHistory(elements as OldCanvasElement[]);
    setMultiSelectIds(new Set(selectedIds));
  }, [oldHistory, setMultiSelectIds]);

  const clear = useCallback(() => {
    setMultiSelectIds(new Set());
  }, [setMultiSelectIds]);

  const value: HistoryContextType = {
    undo: oldHistory.undo,
    redo: oldHistory.redo,
    canUndo: oldHistory.canUndo,
    canRedo: oldHistory.canRedo,
    saveToHistory,
    clear,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryAdapter');
  }
  return context;
};
