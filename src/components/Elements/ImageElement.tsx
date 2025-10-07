import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { ImageElement as ImageElementType } from '../../types';

interface ImageElementProps {
  element: ImageElementType;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

export const ImageElementRenderer: React.FC<ImageElementProps> = ({
  element,
  isSelected,
  onSelect,
  onTransformEnd,
}) => {
  const [image] = useImage(element.src, 'anonymous');

  // Apply filters if any
  const filters = element.filters ? [
    Konva.Filters.Brighten,
    Konva.Filters.Contrast,
    Konva.Filters.HSL,
    Konva.Filters.Blur,
    Konva.Filters.RGB,
  ] : undefined;

  return (
    <Image
      id={element.id}
      image={image}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      opacity={element.opacity}
      visible={element.visible}
      draggable={!element.locked}
      crop={element.cropX !== undefined ? {
        x: element.cropX,
        y: element.cropY || 0,
        width: element.cropWidth || element.width,
        height: element.cropHeight || element.height,
      } : undefined}
      onClick={onSelect}
      onTap={onSelect}
      onTransformEnd={onTransformEnd}
      shadowColor={element.shadow?.enabled ? element.shadow.color : undefined}
      shadowBlur={element.shadow?.enabled ? element.shadow.blur : undefined}
      shadowOffsetX={element.shadow?.enabled ? element.shadow.offsetX : undefined}
      shadowOffsetY={element.shadow?.enabled ? element.shadow.offsetY : undefined}
      shadowOpacity={element.shadow?.enabled ? element.shadow.opacity : undefined}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      filters={filters}
      brightness={element.filters?.brightness}
      contrast={element.filters?.contrast}
      saturation={element.filters?.saturation}
      blur={element.filters?.blur}
      red={element.filters?.red}
      green={element.filters?.green}
      blue={element.filters?.blue}
    />
  );
};
