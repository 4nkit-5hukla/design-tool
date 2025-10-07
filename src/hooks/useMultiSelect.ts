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

  // Calculate bounding box for selected elements including rotation
  const calculateBoundingBox = useCallback((elementIds: string[]) => {
    const selectedElements = elements.filter(el => elementIds.includes(el.id));
    if (selectedElements.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedElements.forEach(el => {
      // Calculate element's actual corners considering rotation
      const centerX = el.x + (el.width * el.scaleX) / 2;
      const centerY = el.y + (el.height * el.scaleY) / 2;
      const width = el.width * el.scaleX;
      const height = el.height * el.scaleY;
      
      const rad = (el.rotation * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      // Calculate all four corners
      const corners = [
        { dx: -width / 2, dy: -height / 2 },
        { dx: width / 2, dy: -height / 2 },
        { dx: width / 2, dy: height / 2 },
        { dx: -width / 2, dy: height / 2 },
      ];

      corners.forEach(({ dx, dy }) => {
        const x = centerX + (dx * cos - dy * sin);
        const y = centerY + (dx * sin + dy * cos);
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      });
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


      const boundingBox = calculateBoundingBox(selectedIds);
      if (boundingBox) {
        setSelectionGroup({
          elementIds: selectedIds,
          boundingBox,
          originalTransforms: transforms,
        });
      }
    } else {
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
    // Note: selectionGroup will be updated by the useEffect watching elements changes
  }, [selectedIds, elements, updateElement]);

  // Scale selected elements proportionally while preserving transforms
  const scaleSelection = useCallback(
    (
      newWidth: number,
      newHeight: number
    ) => {
      if (!selectionGroup || selectedIds.length === 0) return;

      // Use fresh current element state instead of original transforms for scaling
      const currentElements = elements.filter(el => selectedIds.includes(el.id));
      const currentGroupBox = calculateBoundingBox(selectedIds);
      if (!currentGroupBox) return;

      const scaleFactorX = newWidth / currentGroupBox.width;
      const scaleFactorY = newHeight / currentGroupBox.height;
      
      const groupCenterX = currentGroupBox.x + currentGroupBox.width / 2;
      const groupCenterY = currentGroupBox.y + currentGroupBox.height / 2;

      currentElements.forEach(el => {
        // Use current element state
        const elCenterX = el.x + (el.width * el.scaleX) / 2;
        const elCenterY = el.y + (el.height * el.scaleY) / 2;

        // Calculate distance from group center
        const dx = elCenterX - groupCenterX;
        const dy = elCenterY - groupCenterY;

        // Scale distance from center
        const newCenterX = groupCenterX + dx * scaleFactorX;
        const newCenterY = groupCenterY + dy * scaleFactorY;

        // Scale the element incrementally
        const newScaleX = el.scaleX * scaleFactorX;
        const newScaleY = el.scaleY * scaleFactorY;

        // Calculate new top-left position
        const newX = newCenterX - (el.width * newScaleX) / 2;
        const newY = newCenterY - (el.height * newScaleY) / 2;

        updateElement(el.id, {
          x: newX,
          y: newY,
          scaleX: newScaleX,
          scaleY: newScaleY,
        });
      });
      // Note: selectionGroup will be updated by the useEffect watching elements changes
    },
    [selectionGroup, selectedIds, updateElement, elements, calculateBoundingBox]
  );

  // Rotate selected elements around group center while preserving individual rotations
  const rotateSelection = useCallback(
    (rotation: number) => {
      if (!selectionGroup || selectedIds.length === 0) return;

      // Use fresh current element state
      const currentElements = elements.filter(el => selectedIds.includes(el.id));
      const currentGroupBox = calculateBoundingBox(selectedIds);
      if (!currentGroupBox) return;

      const groupCenterX = currentGroupBox.x + currentGroupBox.width / 2;
      const groupCenterY = currentGroupBox.y + currentGroupBox.height / 2;

      currentElements.forEach(el => {
        // Calculate element center from current state
        const elCenterX = el.x + (el.width * el.scaleX) / 2;
        const elCenterY = el.y + (el.height * el.scaleY) / 2;

        // Rotate element center around group center
        const dx = elCenterX - groupCenterX;
        const dy = elCenterY - groupCenterY;
        const rad = (rotation * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const newCenterX = groupCenterX + (dx * cos - dy * sin);
        const newCenterY = groupCenterY + (dx * sin + dy * cos);

        // Calculate new top-left position
        const newX = newCenterX - (el.width * el.scaleX) / 2;
        const newY = newCenterY - (el.height * el.scaleY) / 2;

        // Add rotation incrementally
        const newRotation = el.rotation + rotation;

        updateElement(el.id, {
          x: newX,
          y: newY,
          rotation: newRotation,
        });
      });
      // Note: selectionGroup will be updated by the useEffect watching elements changes
    },
    [selectionGroup, selectedIds, updateElement, elements, calculateBoundingBox]
  );

  return {
    selectionGroup,
    moveSelection,
    scaleSelection,
    rotateSelection,
    hasMultipleSelected: selectedIds.length > 1,
  };
};
