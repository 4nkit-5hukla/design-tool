import React from 'react';
import { Rect, Circle, Star, RegularPolygon } from 'react-konva';
import Konva from 'konva';
import { ShapeElement as ShapeElementType } from '../../types';

interface ShapeElementProps {
  element: ShapeElementType;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

export const ShapeElementRenderer: React.FC<ShapeElementProps> = ({
  element,
  isSelected,
  onSelect,
  onTransformEnd,
}) => {
  const commonProps = {
    id: element.id,
    x: element.x,
    y: element.y,
    scaleX: element.scaleX,
    scaleY: element.scaleY,
    rotation: element.rotation,
    opacity: element.opacity,
    visible: element.visible,
    draggable: !element.locked,
    fill: element.fill,
    stroke: element.stroke,
    strokeWidth: element.strokeWidth,
    onClick: onSelect,
    onTap: onSelect,
    onTransformEnd: onTransformEnd,
    shadowColor: element.shadow?.enabled ? element.shadow.color : undefined,
    shadowBlur: element.shadow?.enabled ? element.shadow.blur : undefined,
    shadowOffsetX: element.shadow?.enabled ? element.shadow.offsetX : undefined,
    shadowOffsetY: element.shadow?.enabled ? element.shadow.offsetY : undefined,
    shadowOpacity: element.shadow?.enabled ? element.shadow.opacity : undefined,
  };

  switch (element.shapeType) {
    case 'rectangle':
      return (
        <Rect
          {...commonProps}
          width={element.width}
          height={element.height}
          cornerRadius={element.cornerRadius || 0}
        />
      );
    
    case 'circle':
      return (
        <Circle
          {...commonProps}
          radius={element.width / 2}
        />
      );
    
    case 'star':
      return (
        <Star
          {...commonProps}
          numPoints={element.numPoints || 5}
          innerRadius={element.innerRadius || element.width * 0.4}
          outerRadius={element.outerRadius || element.width * 0.5}
        />
      );
    
    case 'triangle':
      return (
        <RegularPolygon
          {...commonProps}
          sides={3}
          radius={element.width / 2}
        />
      );
    
    default:
      return null;
  }
};
