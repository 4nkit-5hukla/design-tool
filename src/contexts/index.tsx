import React, { ReactNode } from 'react';
import { ElementsProvider } from './ElementsContext';
import { SelectionProvider } from './SelectionContext';
import { HistoryProvider } from './HistoryContext';
import { CanvasProvider } from './CanvasContext';

// Export all contexts
export * from './ElementsContext';
export * from './SelectionContext';
export * from './HistoryContext';
export * from './CanvasContext';

// Combined provider for easy app setup
export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CanvasProvider>
      <ElementsProvider>
        <SelectionProvider>
          <HistoryProvider>
            {children}
          </HistoryProvider>
        </SelectionProvider>
      </ElementsProvider>
    </CanvasProvider>
  );
};
