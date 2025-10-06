/* eslint-disable react-hooks/exhaustive-deps */
import { RefObject, useState, useEffect } from "react";

import { WindowSize } from "Interfaces";

export const useResizer = ({
  width,
  height,
  ref,
  responsive,
  aspectRatio,
}: {
  width: WindowSize["width"];
  height: WindowSize["height"];
  ref: RefObject<HTMLElement>;
  responsive: boolean;
  aspectRatio: number;
}): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width,
    height,
  });

  useEffect(() => {
    const handleResize = () => {
      const container = ref.current;

      if (!container) return;

      const containerWidth = container.offsetWidth;

      setWindowSize({
        width: containerWidth,
        height: responsive ? containerWidth * aspectRatio : height,
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
