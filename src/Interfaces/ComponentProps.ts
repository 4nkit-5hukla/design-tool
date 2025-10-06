import { KonvaEventObject } from "konva/lib/Node";
import Konva from "konva";

export type ElementShape = Konva.ShapeConfig & {
  id: string;
  type: string;
  name?: string;
  lock?: boolean;
};

export interface UpdateElementOptions {
  saveHistory?: boolean;
}

export interface ToolbarProps {
  selectedEl?: ElementShape | null;
  updateElement: <T extends ElementShape>(
    config: T & { id: string },
    options?: UpdateElementOptions
  ) => ElementShape[];
}

export interface ShadowProps extends ToolbarProps {
  shadowEnabled?: boolean;
}

export interface StrokeProps extends ToolbarProps {
  strokeEnabled?: boolean;
}

export interface ImageAdjustmentState {
  blue?: number;
  blurRadius?: number;
  brightness?: number;
  contrast?: number;
  enhance?: number;
  green?: number;
  red?: number;
  rgb?: boolean;
  saturation?: number;
}

export interface TextAdjustmentProps extends ToolbarProps {
  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  textDecoration?: string;
  align?: string;
  lineHeight?: number;
}

export interface ShapeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  rotation?: number;
  opacity?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
  shadowEnabled?: boolean;
}

export interface TransformableElementProps {
  element: ElementShape;
  isSelected: boolean;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  onDragStart?: (e: KonvaEventObject<DragEvent>) => void;
  onDragMove?: (e: KonvaEventObject<DragEvent>) => void;
  onDragEnd?: (e: KonvaEventObject<DragEvent>) => void;
}

export interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  disabled?: boolean;
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  label?: string;
}
