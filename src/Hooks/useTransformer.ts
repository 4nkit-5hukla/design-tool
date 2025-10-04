/* eslint-disable react-hooks/exhaustive-deps */
import Konva from "konva";
import { RefObject, useEffect } from "react";

export const useTransformer = <T>({
  isSelected,
  ref,
  transformer,
}: {
  isSelected: boolean;
  ref: RefObject<T>;
  transformer: RefObject<Konva.Transformer> | any;
}) => {
  useEffect(() => {
    if (transformer.current !== null && isSelected) {
      transformer.current.nodes([ref.current]);
      transformer.current.getLayer().batchDraw();
    }
  }, [isSelected]);
};
