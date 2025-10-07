import { useEffect, useRef } from 'react';
import Konva from 'konva';

interface UseTransformerProps {
  selectedIds: string[];
  onTransformEnd?: (id: string, attrs: any) => void;
}

/**
 * Hook to manage Konva transformer for selected elements
 */
export const useTransformer = ({ selectedIds, onTransformEnd }: UseTransformerProps) => {
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const nodesRef = useRef<Konva.Node[]>([]);

  useEffect(() => {
    if (!transformerRef.current) return;

    const transformer = transformerRef.current;
    const stage = transformer.getStage();
    if (!stage) return;

    // Find all selected nodes
    const nodes: Konva.Node[] = [];
    selectedIds.forEach(id => {
      const node = stage.findOne(`#${id}`);
      if (node) {
        nodes.push(node);
      }
    });

    nodesRef.current = nodes;

    // Attach transformer to nodes
    if (nodes.length > 0) {
      transformer.nodes(nodes);
    } else {
      transformer.nodes([]);
    }

    transformer.getLayer()?.batchDraw();
  }, [selectedIds]);

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target;
    if (onTransformEnd && node.id()) {
      const attrs = {
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
        width: node.width(),
        height: node.height(),
      };
      onTransformEnd(node.id(), attrs);
    }
  };

  return {
    transformerRef,
    handleTransformEnd,
  };
};
