/* eslint-disable react-hooks/exhaustive-deps */
import Konva from "konva";
import { MutableRefObject, useEffect } from "react";

export const useTransformer = <T extends Konva.Shape>({
  isSelected,
  ref,
  transformer,
}: {
  isSelected: boolean;
  ref: MutableRefObject<T>;
  transformer: MutableRefObject<Konva.Transformer> | any;
}) => {
  useEffect(() => {
    if (transformer.current !== null && isSelected) {
      transformer.current.nodes([ref.current]);
      transformer.current.getLayer().batchDraw();
    }
  }, [isSelected]);
};
