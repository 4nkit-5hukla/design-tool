import Konva from "konva";
import { Dispatch, SetStateAction } from "react";
import { UpdateElementOptions } from "./ComponentProps";
import { CanvasElement } from "./Elements";

export interface UpdateElementFn {
  <T extends Partial<CanvasElement>>(
    config: T & { id: string },
    options?: UpdateElementOptions
  ): CanvasElement[];
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
