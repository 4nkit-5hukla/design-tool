import { CanvasElement } from './elements';

// History state for undo/redo
export interface HistoryState {
  elements: CanvasElement[];
  selectedIds: string[];
  timestamp: number;
}

export interface HistoryActions {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  addToHistory: (elements: CanvasElement[], selectedIds: string[]) => void;
  clear: () => void;
}
