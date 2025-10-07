import React from 'react';
import { Text } from 'react-konva';
import Konva from 'konva';
import { TextElement as TextElementType } from '../../types';

interface TextElementProps {
  element: TextElementType;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}

export const TextElementRenderer: React.FC<TextElementProps> = ({
  element,
  isSelected,
  onSelect,
  onTransformEnd,
}) => {
  return (
    <Text
      id={element.id}
      x={element.x}
      y={element.y}
      text={element.text}
      fontSize={element.fontSize}
      fontFamily={element.fontFamily}
      fontStyle={element.fontStyle}
      fill={element.fill}
      align={element.align}
      width={element.width}
      height={element.height}
      scaleX={element.scaleX}
      scaleY={element.scaleY}
      rotation={element.rotation}
      opacity={element.opacity}
      visible={element.visible}
      draggable={!element.locked}
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
      lineHeight={element.lineHeight}
      letterSpacing={element.letterSpacing}
      textDecoration={element.textDecoration}
    />
  );
};
