import { useState, useCallback, useRef } from 'react';
import { ImageElement } from '../types';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseImageCropResult {
  isCropping: boolean;
  cropArea: CropArea | null;
  startCrop: (element: ImageElement) => void;
  updateCropArea: (area: CropArea) => void;
  applyCrop: () => ImageElement | null;
  cancelCrop: () => void;
}

/**
 * Hook for image cropping functionality
 * Allows users to crop images on the canvas
 */
export const useImageCrop = (): UseImageCropResult => {
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const currentElementRef = useRef<ImageElement | null>(null);

  const startCrop = useCallback((element: ImageElement) => {
    currentElementRef.current = element;
    
    // Initialize crop area to full image
    setCropArea({
      x: 0,
      y: 0,
      width: element.width,
      height: element.height,
    });
    
    setIsCropping(true);
  }, []);

  const updateCropArea = useCallback((area: CropArea) => {
    setCropArea(area);
  }, []);

  const applyCrop = useCallback((): ImageElement | null => {
    if (!currentElementRef.current || !cropArea) {
      return null;
    }

    const element = currentElementRef.current;
    
    // Calculate the crop parameters relative to the original image
    const scaleX = element.scaleX || 1;
    const scaleY = element.scaleY || 1;
    
    // Create cropped element
    const croppedElement: ImageElement = {
      ...element,
      cropX: cropArea.x / scaleX,
      cropY: cropArea.y / scaleY,
      cropWidth: cropArea.width / scaleX,
      cropHeight: cropArea.height / scaleY,
      width: cropArea.width,
      height: cropArea.height,
    };

    // Reset crop state
    setIsCropping(false);
    setCropArea(null);
    currentElementRef.current = null;

    return croppedElement;
  }, [cropArea]);

  const cancelCrop = useCallback(() => {
    setIsCropping(false);
    setCropArea(null);
    currentElementRef.current = null;
  }, []);

  return {
    isCropping,
    cropArea,
    startCrop,
    updateCropArea,
    applyCrop,
    cancelCrop,
  };
};
