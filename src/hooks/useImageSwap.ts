import { useCallback } from 'react';
import { ImageElement } from '../types';
import { UnsplashImage } from '../types/unsplash';

interface UseImageSwapResult {
  swapImage: (element: ImageElement, unsplashImage: UnsplashImage) => ImageElement;
}

/**
 * Hook for swapping image source on existing image elements
 * Preserves element position, size, and transformations while changing the image
 */
export const useImageSwap = (): UseImageSwapResult => {
  const swapImage = useCallback((element: ImageElement, unsplashImage: UnsplashImage): ImageElement => {
    // Calculate appropriate image URL based on element size
    const imageUrl = getOptimizedImageUrl(unsplashImage, element.width, element.height);
    
    // Create new element with swapped image
    // Preserve all transformations and properties except the image source
    const swappedElement: ImageElement = {
      ...element,
      src: imageUrl,
      // Reset crop if any, since it was for the old image
      cropX: undefined,
      cropY: undefined,
      cropWidth: undefined,
      cropHeight: undefined,
    };

    return swappedElement;
  }, []);

  return { swapImage };
};

/**
 * Get optimized Unsplash image URL based on element dimensions
 */
function getOptimizedImageUrl(image: UnsplashImage, width: number, height: number): string {
  // Calculate the optimal size (1.5x for retina displays)
  const targetWidth = Math.ceil(width * 1.5);
  const targetHeight = Math.ceil(height * 1.5);
  
  // Use Unsplash's image optimization API
  const params = new URLSearchParams({
    w: targetWidth.toString(),
    h: targetHeight.toString(),
    fit: 'crop',
    crop: 'center',
  });
  
  return `${image.urls.raw}&${params.toString()}`;
}
