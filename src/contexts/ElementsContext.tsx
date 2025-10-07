import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CanvasElement } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ElementsContextType {
  elements: CanvasElement[];
  addElement: (element: Omit<CanvasElement, 'id'>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  deleteElements: (ids: string[]) => void;
  duplicateElement: (id: string) => string | null;
  duplicateElements: (ids: string[]) => string[];
  getElement: (id: string) => CanvasElement | undefined;
  setElements: (elements: CanvasElement[]) => void;
  moveElement: (id: string, dx: number, dy: number) => void;
  moveElements: (ids: string[], dx: number, dy: number) => void;
  reorderElement: (id: string, newZIndex: number) => void;
}

const ElementsContext = createContext<ElementsContextType | undefined>(undefined);

export const ElementsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<CanvasElement[]>([]);

  const addElement = useCallback((element: Omit<CanvasElement, 'id'>) => {
    const id = uuidv4();
    const newElement = { ...element, id } as CanvasElement;
    setElements(prev => [...prev, newElement]);
    return id;
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements(prev =>
      prev.map(el => {
        if (el.id === id) {
          return { ...el, ...updates } as CanvasElement;
        }
        return el;
      })
    );
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
  }, []);

  const deleteElements = useCallback((ids: string[]) => {
    setElements(prev => prev.filter(el => !ids.includes(el.id)));
  }, []);

  const duplicateElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    if (!element) return null;

    const newId = uuidv4();
    const duplicated = {
      ...element,
      id: newId,
      x: element.x + 20,
      y: element.y + 20,
    };
    setElements(prev => [...prev, duplicated]);
    return newId;
  }, [elements]);

  const duplicateElements = useCallback((ids: string[]) => {
    const toDuplicate = elements.filter(el => ids.includes(el.id));
    const newIds: string[] = [];
    
    const duplicated = toDuplicate.map(element => {
      const newId = uuidv4();
      newIds.push(newId);
      return {
        ...element,
        id: newId,
        x: element.x + 20,
        y: element.y + 20,
      };
    });

    setElements(prev => [...prev, ...duplicated]);
    return newIds;
  }, [elements]);

  const getElement = useCallback((id: string) => {
    return elements.find(el => el.id === id);
  }, [elements]);

  const moveElement = useCallback((id: string, dx: number, dy: number) => {
    setElements(prev =>
      prev.map(el =>
        el.id === id ? { ...el, x: el.x + dx, y: el.y + dy } : el
      )
    );
  }, []);

  const moveElements = useCallback((ids: string[], dx: number, dy: number) => {
    setElements(prev =>
      prev.map(el =>
        ids.includes(el.id) ? { ...el, x: el.x + dx, y: el.y + dy } : el
      )
    );
  }, []);

  const reorderElement = useCallback((id: string, newZIndex: number) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, zIndex: newZIndex } : el))
    );
  }, []);

  const value: ElementsContextType = {
    elements,
    addElement,
    updateElement,
    deleteElement,
    deleteElements,
    duplicateElement,
    duplicateElements,
    getElement,
    setElements,
    moveElement,
    moveElements,
    reorderElement,
  };

  return (
    <ElementsContext.Provider value={value}>
      {children}
    </ElementsContext.Provider>
  );
};

export const useElements = () => {
  const context = useContext(ElementsContext);
  if (!context) {
    throw new Error('useElements must be used within ElementsProvider');
  }
  return context;
};
