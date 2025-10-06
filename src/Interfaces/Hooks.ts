import Konva from "konva";
import { Dispatch, SetStateAction } from "react";
import { UpdateElementOptions } from "./ComponentProps";

export interface UpdateElementFn {
  <T extends Konva.ShapeConfig>(
    config: T & { id: string },
    options?: UpdateElementOptions
  ): Konva.ShapeConfig[];
}

export interface UseDraggableParams {
  updateElement: UpdateElementFn;
}

export interface UseFilterParams {
  selected: string | null;
  updateElement: UpdateElementFn;
}

export interface UseZoomParams {
  origin: {
    x: number;
    y: number;
  };
}

export interface GoogleFont {
  font: string;
  weights?: string[];
}

export interface GoogleFontProps {
  fonts: GoogleFont[];
  subsets?: string[];
  display?: string;
  onLoad?: () => void;
}

export interface FilterFunctions {
  applyFilter: (config: { type: string }) => (value: number | boolean) => void;
  previewFilter: (config: { type: string }) => (value: number | boolean) => void;
}

export interface UseStageReturn {
  stage: Konva.Stage | undefined;
  setStage: Dispatch<SetStateAction<Konva.Stage | undefined>>;
  layer: Konva.Layer | undefined;
  setLayer: Dispatch<SetStateAction<Konva.Layer | undefined>>;
}
