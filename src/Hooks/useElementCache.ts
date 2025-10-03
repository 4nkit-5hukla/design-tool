/* eslint-disable react-hooks/exhaustive-deps */
import Konva from "konva";
import { MutableRefObject, useEffect } from "react";

export const useElementCache = <T extends Konva.Shape>({
  ref,
  deps,
}: {
  ref: MutableRefObject<T>;
  deps: any[];
}) => {
  useEffect(() => {
    ref.current.cache();
  }, [...deps]);
};
