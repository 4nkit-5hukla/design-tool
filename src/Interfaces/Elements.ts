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

interface BaseElement {
  id: string;
  type: string;
  lock?: boolean;
  rotation?: number;
  group?: string[];
  scaleX: number;
  scaleY: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  fontStyle?: string;
  textDecoration?: string;
  align?: string;
  fill: string;
  letterSpacing?: number;
  lineHeight?: number;
  opacity?: number;
  strokeEnabled?: boolean;
  stroke?: string;
  strokeWidth?: number;
  shadowEnabled?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
}

export interface ImageElement extends BaseElement {
  type: "image";
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
  isCropped: boolean;
  isCropping: boolean;
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

export interface ClippedImageElement extends BaseElement {
  type: "clippedImage";
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

export interface PathElement extends BaseElement {
  type: "path";
  x: number;
  y: number;
  data: string;
  height: number;
  width: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeType?: string;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
  useAnchors?: boolean;
  opacity?: number;
}

export interface FlatSVGElement extends BaseElement {
  type: "flat-svg";
  x: number;
  y: number;
  width: number;
  height: number;
  colors: string[];
  fill: string;
  scaled?: boolean;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
}

export interface CircleElement extends BaseElement {
  type: "circle" | "ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
}

export interface RectangleElement extends BaseElement {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
}

export interface StarElement extends BaseElement {
  type: "star";
  x: number;
  y: number;
  numPoints: number;
  innerRadius: number;
  outerRadius: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
}

export interface TriangleElement extends BaseElement {
  type: "triangle";
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
}

export type CanvasElement =
  | TextElement
  | ImageElement
  | ClippedImageElement
  | PathElement
  | FlatSVGElement
  | CircleElement
  | RectangleElement
  | StarElement
  | TriangleElement;

export type ImageElementState = ImageElement;
export type ClippedImageElementState = ClippedImageElement;

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
