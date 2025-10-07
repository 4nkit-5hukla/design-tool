import React from 'react';
import { Path } from 'react-konva';
import Konva from 'konva';
import { SVGElement as SVGElementType } from '../../types';

interface SVGElementProps {
  element: SVGElementType;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

export const SVGElementRenderer: React.FC<SVGElementProps> = ({
  element,
  isSelected: _isSelected,
  onSelect,
  onTransformEnd,
}) => {
  return (
    <Path
      id={element.id}
      data={element.svgData}
      x={element.x}
      y={element.y}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      opacity={element.opacity}
      visible={element.visible}
      draggable={!element.locked}
      fill={element.fill}
      stroke={element.stroke}
      strokeWidth={element.strokeWidth}
      onClick={onSelect}
      onTap={onSelect}
      onTransformEnd={onTransformEnd}
      shadowColor={element.shadow?.enabled ? element.shadow.color : undefined}
      shadowBlur={element.shadow?.enabled ? element.shadow.blur : undefined}
      shadowOffsetX={element.shadow?.enabled ? element.shadow.offsetX : undefined}
      shadowOffsetY={element.shadow?.enabled ? element.shadow.offsetY : undefined}
      shadowOpacity={element.shadow?.enabled ? element.shadow.opacity : undefined}
    />
  );
};
