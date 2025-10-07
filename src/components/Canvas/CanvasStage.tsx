import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import { useElements, useSelection, useCanvas } from '../../contexts';
import { useTransformer } from '../../hooks';
import { TextElementRenderer } from '../Elements/TextElement';
import { ImageElementRenderer } from '../Elements/ImageElement';
import { ShapeElementRenderer } from '../Elements/ShapeElement';
import { SVGElementRenderer } from '../Elements/SVGElement';
import styles from './CanvasStage.module.scss';

export const CanvasStage: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 1920, height: 1080 });
  
  const { elements, updateElement } = useElements();
  const { selectedIds, selectElement, deselectAll } = useSelection();
  const { width, height, backgroundColor, scale, offsetX, offsetY } = useCanvas();

  const { transformerRef, handleTransformEnd } = useTransformer({
    selectedIds,
    onTransformEnd: (id, attrs) => {
      updateElement(id, attrs);
    },
  });

  // Update stage size based on container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle stage click for deselection
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.getClassName() === 'Rect';
    if (clickedOnEmpty) {
      deselectAll();
    }
  };

  // Handle element click
  const handleElementClick = (id: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    const isShiftKey = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    selectElement(id, isShiftKey);
  };

  // Render element based on type
  const renderElement = (element: typeof elements[0]) => {
    const isSelected = selectedIds.includes(element.id);
    const onSelect = (e: Konva.KonvaEventObject<MouseEvent>) => handleElementClick(element.id, e);

    switch (element.type) {
      case 'text':
        return (
          <TextElementRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'image':
        return (
          <ImageElementRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'shape':
        return (
          <ShapeElementRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onTransformEnd={handleTransformEnd}
          />
        );
      case 'svg':
        return (
          <SVGElementRenderer
            key={element.id}
            element={element}
            isSelected={isSelected}
            onSelect={onSelect}
            onTransformEnd={handleTransformEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className={styles.canvasContainer}>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={offsetX}
        y={offsetY}
        onClick={handleStageClick}
        onTap={handleStageClick}
      >
        <Layer>
          {/* Canvas background */}
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={backgroundColor}
            listening={false}
          />
          
          {/* Render all elements */}
          {elements
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(renderElement)}
          
          {/* Transformer for selected elements */}
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit minimum size
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};
