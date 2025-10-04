import { KonvaEventObject } from "konva/lib/Node";

export enum Mode {
  NotSelectedNotCropped = 0,
  NotSelectedCropped = 1,
  SelectedNotCropped = 2,
  SelectedCropped = 3,
  SelectedCropping = 4,
}

export enum Anchor {
  None = 0,
  TopLeft = 1,
  TopRight = 3,
  BottomLeft = 6,
  BottomRight = 8,
}

export enum Action {
  None = 0,
  Drag = 1,
  Rotate = 2,
  OuterTransform = 3,
  InnerTransform = 4,
}

export interface ImageElementState {
  id: string;
  type: string;
  name?: string;
  src: string;
  image: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  innerOffsetX: number;
  innerOffsetY: number;
  innerWidth: number;
  innerHeight: number;
  flip?: boolean;
  rotation: number;
  isCropped: boolean;
  isCropping: boolean;
  lock?: boolean;
  scale: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
  blue?: number;
  blurRadius?: number;
  brightness?: number;
  contrast?: number;
  enhance?: number;
  green?: number;
  red?: number;
  rgb?: boolean;
  saturation?: number;
  strokeEnabled?: boolean;
  stroke?: string;
  strokeWidth?: number;
}

export interface ClippedImageElementState {
  id: string;
  type: string;
  src: string;
  image: HTMLImageElement;
  imageDeltaX: number;
  imageDeltaY: number;
  imageWidth: number;
  imageHeight: number;
  shapeX: number;
  shapeY: number;
  shapeWidth: number;
  shapeHeight: number;
  isClipping: boolean;
  flipX?: boolean;
  flipY?: boolean;
  rotation: number;
  lock?: boolean;
  opacity?: number;
  svgPath: string;
  shapeElement: {
    width: number;
    height: number;
  };
  stroke?: string;
  strokeType?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
}

export interface ElementPropsBase {
  isSelected: boolean;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onMouseDown?: (e: KonvaEventObject<MouseEvent>) => void;
  onDragMove?: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
}

export interface CropableImageProps extends ElementPropsBase {
  state: ImageElementState;
  setState: (state: ImageElementState) => void;
}

export interface ClippedImageProps extends ElementPropsBase {
  state: ClippedImageElementState;
  setState: (state: ClippedImageElementState) => void;
}
