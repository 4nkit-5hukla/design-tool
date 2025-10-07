// Core element types for the canvas

export type ElementType = 'text' | 'image' | 'shape' | 'svg';

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'star';

// Base properties shared by all elements
export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
}

// Text element
export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: 'normal' | 'italic';
  fontWeight: 'normal' | 'bold';
  textDecoration: 'none' | 'underline' | 'line-through';
  fill: string;
  align: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
  letterSpacing: number;
  stroke?: string;
  strokeWidth?: number;
  shadow?: ElementShadow;
}

// Image element
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
  filters?: ImageFilters;
  stroke?: string;
  strokeWidth?: number;
  shadow?: ElementShadow;
}

// Shape element
export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  shadow?: ElementShadow;
  // For star
  numPoints?: number;
  innerRadius?: number;
  outerRadius?: number;
  // For rounded rectangle
  cornerRadius?: number;
}

// SVG element
export interface SVGElement extends BaseElement {
  type: 'svg';
  svgData: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  shadow?: ElementShadow;
}

// Union type for all elements
export type CanvasElement = TextElement | ImageElement | ShapeElement | SVGElement;

// Shadow properties
export interface ElementShadow {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
}

// Image filters
export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  red: number;
  green: number;
  blue: number;
}

// Transform data for multi-select
export interface ElementTransform {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  width: number;
  height: number;
}

// Multi-select group
export interface SelectionGroup {
  elementIds: string[];
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  originalTransforms: ElementTransform[];
}
