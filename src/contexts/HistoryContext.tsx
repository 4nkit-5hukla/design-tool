import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { CanvasElement } from '../types';

interface HistoryState {
  elements: CanvasElement[];
  selectedIds: string[];
}

interface HistoryContextType {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveToHistory: (elements: CanvasElement[], selectedIds: string[]) => void;
  clear: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const MAX_HISTORY = 50;

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingStateRef = useRef<HistoryState | null>(null);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  // Debounced save to history (300ms)
  const saveToHistory = useCallback((elements: CanvasElement[], selectedIds: string[]) => {
    const newState: HistoryState = {
      elements: JSON.parse(JSON.stringify(elements)), // Deep clone
      selectedIds: [...selectedIds],
    };

    pendingStateRef.current = newState;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (pendingStateRef.current) {
        setHistory(prev => {
          const newHistory = prev.slice(0, currentIndex + 1);
          newHistory.push(pendingStateRef.current!);
          
          // Limit history size
          if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
            setCurrentIndex(prev => prev - 1);
          }
          
          return newHistory;
        });
        setCurrentIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
        pendingStateRef.current = null;
      }
    }, 300);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      // Flush pending changes before undo
      if (pendingStateRef.current && saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        setHistory(prev => {
          const newHistory = prev.slice(0, currentIndex + 1);
          newHistory.push(pendingStateRef.current!);
          return newHistory;
        });
        pendingStateRef.current = null;
      }
      setCurrentIndex(prev => prev - 1);
    }
  }, [canUndo, currentIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      // Flush pending changes before redo
      if (pendingStateRef.current && saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        setHistory(prev => {
          const newHistory = prev.slice(0, currentIndex + 1);
          newHistory.push(pendingStateRef.current!);
          return newHistory;
        });
        pendingStateRef.current = null;
      }
      setCurrentIndex(prev => prev + 1);
    }
  }, [canRedo, currentIndex]);

  const clear = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setHistory([]);
    setCurrentIndex(-1);
    pendingStateRef.current = null;
  }, []);

  const value: HistoryContextType = {
    undo,
    redo,
    canUndo,
    canRedo,
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
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};

// Hook to get current history state
export const useHistoryState = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistoryState must be used within HistoryProvider');
  }
  // This would need access to history and currentIndex
  // Will be implemented when integrating with elements
  return null;
};
