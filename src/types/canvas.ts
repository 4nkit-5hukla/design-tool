// Canvas and stage types

export interface CanvasState {
  width: number;
  height: number;
  backgroundColor: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface StageConfig {
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  x: number;
  y: number;
}

export interface ViewportBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BoundingBox extends Position, Size {
  rotation?: number;
}
