import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CanvasState } from '../types';

interface CanvasContextType extends CanvasState {
  setScale: (scale: number) => void;
  setOffset: (x: number, y: number) => void;
  setBackgroundColor: (color: string) => void;
  setDimensions: (width: number, height: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  resetZoom: () => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

const DEFAULT_CANVAS: CanvasState = {
  width: 1920,
  height: 1080,
  backgroundColor: '#ffffff',
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

const MIN_SCALE = 0.1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.1;

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [canvas, setCanvas] = useState<CanvasState>(DEFAULT_CANVAS);

  const setScale = useCallback((scale: number) => {
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
    setCanvas(prev => ({ ...prev, scale: clampedScale }));
  }, []);

  const setOffset = useCallback((x: number, y: number) => {
    setCanvas(prev => ({ ...prev, offsetX: x, offsetY: y }));
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    setCanvas(prev => ({ ...prev, backgroundColor: color }));
  }, []);

  const setDimensions = useCallback((width: number, height: number) => {
    setCanvas(prev => ({ ...prev, width, height }));
  }, []);

  const zoomIn = useCallback(() => {
    setScale(canvas.scale + ZOOM_STEP);
  }, [canvas.scale, setScale]);

  const zoomOut = useCallback(() => {
    setScale(canvas.scale - ZOOM_STEP);
  }, [canvas.scale, setScale]);

  const zoomToFit = useCallback(() => {
    // This will be implemented based on stage size
    setScale(1);
    setOffset(0, 0);
  }, [setScale, setOffset]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setOffset(0, 0);
  }, [setScale, setOffset]);

  const value: CanvasContextType = {
    ...canvas,
    setScale,
    setOffset,
    setBackgroundColor,
    setDimensions,
    zoomIn,
    zoomOut,
    zoomToFit,
    resetZoom,
  };

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within CanvasProvider');
  }
  return context;
};
