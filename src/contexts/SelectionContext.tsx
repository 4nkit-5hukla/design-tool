import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SelectionGroup } from '../types';

interface SelectionContextType {
  selectedIds: string[];
  selectElement: (id: string, append?: boolean) => void;
  selectElements: (ids: string[]) => void;
  deselectElement: (id: string) => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string) => void;
  selectionGroup: SelectionGroup | null;
  setSelectionGroup: (group: SelectionGroup | null) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionGroup, setSelectionGroup] = useState<SelectionGroup | null>(null);

  const selectElement = useCallback((id: string, append: boolean = false) => {
    setSelectedIds(prev => {
      if (append) {
        return prev.includes(id) ? prev : [...prev, id];
      }
      return [id];
    });
    // Clear group when single selecting
    if (!append) {
      setSelectionGroup(null);
    }
  }, []);

  const selectElements = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const deselectElement = useCallback((id: string) => {
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
  }, []);

  const deselectAll = useCallback(() => {
    setSelectedIds([]);
    setSelectionGroup(null);
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      }
      return [...prev, id];
    });
  }, []);

  const value: SelectionContextType = {
    selectedIds,
    selectElement,
    selectElements,
    deselectElement,
    deselectAll,
    isSelected,
    toggleSelection,
    selectionGroup,
    setSelectionGroup,
  };

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within SelectionProvider');
  }
  return context;
};
