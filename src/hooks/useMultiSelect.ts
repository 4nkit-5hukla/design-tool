import { useCallback, useEffect, useRef } from 'react';
import { useElements, useSelection } from '../contexts';
import { ElementTransform } from '../types';

/**
 * Hook to manage multi-select with transform preservation
 * This ensures that when multiple elements are transformed together,
 * their individual transformations are preserved
 */
export const useMultiSelect = () => {
  const { elements, updateElement } = useElements();
  const { selectedIds, selectionGroup, setSelectionGroup } = useSelection();
  const originalTransformsRef = useRef<ElementTransform[]>([]);

  // Calculate bounding box for selected elements
  const calculateBoundingBox = useCallback((elementIds: string[]) => {
    const selectedElements = elements.filter(el => elementIds.includes(el.id));
    if (selectedElements.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedElements.forEach(el => {
      const x = el.x;
      const y = el.y;
      const width = el.width * el.scaleX;
      const height = el.height * el.scaleY;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      rotation: 0, // Group rotation is separate from individual rotations
    };
  }, [elements]);

  // Store original transforms when multi-select starts
  useEffect(() => {
    if (selectedIds.length > 1) {
      const transforms: ElementTransform[] = selectedIds.map(id => {
        const el = elements.find(e => e.id === id);
        if (!el) {
          return {
            id,
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            width: 0,
            height: 0,
          };
        }
        return {
          id: el.id,
          x: el.x,
          y: el.y,
          rotation: el.rotation,
          scaleX: el.scaleX,
          scaleY: el.scaleY,
          width: el.width,
          height: el.height,
        };
      });

      originalTransformsRef.current = transforms;

      const boundingBox = calculateBoundingBox(selectedIds);
      if (boundingBox) {
        setSelectionGroup({
          elementIds: selectedIds,
          boundingBox,
          originalTransforms: transforms,
        });
      }
    } else {
      originalTransformsRef.current = [];
      setSelectionGroup(null);
    }
  }, [selectedIds, elements, calculateBoundingBox, setSelectionGroup]);

  // Move selected elements while preserving individual transforms
  const moveSelection = useCallback((dx: number, dy: number) => {
    if (selectedIds.length === 0) return;

    selectedIds.forEach(id => {
      const el = elements.find(e => e.id === id);
      if (el) {
        updateElement(id, {
          x: el.x + dx,
          y: el.y + dy,
        });
      }
    });

    // Update bounding box
    if (selectionGroup) {
      setSelectionGroup({
        ...selectionGroup,
        boundingBox: {
          ...selectionGroup.boundingBox,
          x: selectionGroup.boundingBox.x + dx,
          y: selectionGroup.boundingBox.y + dy,
        },
      });
    }
  }, [selectedIds, elements, updateElement, selectionGroup, setSelectionGroup]);

  // Scale selected elements proportionally while preserving transforms
  const scaleSelection = useCallback(
    (
      newWidth: number,
      newHeight: number
    ) => {
      if (!selectionGroup || selectedIds.length === 0) return;

      const { boundingBox, originalTransforms } = selectionGroup;
      const scaleX = newWidth / boundingBox.width;
      const scaleY = newHeight / boundingBox.height;

      selectedIds.forEach(id => {
        const original = originalTransforms.find(t => t.id === id);
        if (!original) return;

        // Calculate new position relative to center
        const relX = original.x - boundingBox.x;
        const relY = original.y - boundingBox.y;
        
        const newRelX = relX * scaleX;
        const newRelY = relY * scaleY;
        
        const newX = boundingBox.x + newRelX;
        const newY = boundingBox.y + newRelY;

        // Scale the element itself
        const newScaleX = original.scaleX * scaleX;
        const newScaleY = original.scaleY * scaleY;

        updateElement(id, {
          x: newX,
          y: newY,
          scaleX: newScaleX,
          scaleY: newScaleY,
        });
      });
    },
    [selectionGroup, selectedIds, updateElement]
  );

  // Rotate selected elements around group center while preserving individual rotations
  const rotateSelection = useCallback(
    (rotation: number) => {
      if (!selectionGroup || selectedIds.length === 0) return;

      const { boundingBox, originalTransforms } = selectionGroup;
      const centerX = boundingBox.x + boundingBox.width / 2;
      const centerY = boundingBox.y + boundingBox.height / 2;

      selectedIds.forEach(id => {
        const original = originalTransforms.find(t => t.id === id);
        if (!original) return;

        // Rotate element position around center
        const dx = original.x - centerX;
        const dy = original.y - centerY;
        const rad = (rotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const newX = centerX + (dx * cos - dy * sin);
        const newY = centerY + (dx * sin + dy * cos);

        // Add rotation to element while preserving its original rotation
        const newRotation = original.rotation + rotation;

        updateElement(id, {
          x: newX,
          y: newY,
          rotation: newRotation,
        });
      });
    },
    [selectionGroup, selectedIds, updateElement]
  );

  return {
    selectionGroup,
    moveSelection,
    scaleSelection,
    rotateSelection,
    hasMultipleSelected: selectedIds.length > 1,
  };
};
