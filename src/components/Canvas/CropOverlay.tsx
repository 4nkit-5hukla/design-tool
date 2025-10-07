import React, { useRef, useEffect } from 'react';
import { Rect, Transformer } from 'react-konva';
import Konva from 'konva';

interface CropOverlayProps {
  x: number;
  y: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
  onCropChange: (area: { x: number; y: number; width: number; height: number }) => void;
}

/**
 * Crop overlay component for image cropping
 * Displays a resizable rectangle over an image for cropping
 */
export const CropOverlay: React.FC<CropOverlayProps> = ({
  x,
  y,
  width,
  height,
  imageWidth,
  imageHeight,
  onCropChange,
}) => {
  const cropRectRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (transformerRef.current && cropRectRef.current) {
      transformerRef.current.nodes([cropRectRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, []);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target as Konva.Rect;
    const newX = Math.max(0, Math.min(node.x(), imageWidth - node.width()));
    const newY = Math.max(0, Math.min(node.y(), imageHeight - node.height()));
    
    node.x(newX);
    node.y(newY);
    
    onCropChange({
      x: newX,
      y: newY,
      width: node.width(),
      height: node.height(),
    });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Rect;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale and apply to width/height
    node.scaleX(1);
    node.scaleY(1);
    
    const newWidth = Math.max(20, node.width() * scaleX);
    const newHeight = Math.max(20, node.height() * scaleY);
    
    // Constrain to image bounds
    const constrainedWidth = Math.min(newWidth, imageWidth - node.x());
    const constrainedHeight = Math.min(newHeight, imageHeight - node.y());
    
    node.width(constrainedWidth);
    node.height(constrainedHeight);
    
    onCropChange({
      x: node.x(),
      y: node.y(),
      width: constrainedWidth,
      height: constrainedHeight,
    });
  };

  return (
    <>
      <Rect
        ref={cropRectRef}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="#00a8ff"
        strokeWidth={2}
        dash={[10, 5]}
        draggable
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        dragBoundFunc={(pos) => {
          const node = cropRectRef.current;
          if (!node) return pos;
          
          return {
            x: Math.max(0, Math.min(pos.x, imageWidth - node.width())),
            y: Math.max(0, Math.min(pos.y, imageHeight - node.height())),
          };
        }}
      />
      <Transformer
        ref={transformerRef}
        boundBoxFunc={(oldBox, newBox) => {
          // Constrain to image bounds
          if (newBox.width < 20 || newBox.height < 20) {
            return oldBox;
          }
          return newBox;
        }}
        enabledAnchors={[
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
        ]}
      />
    </>
  );
};
