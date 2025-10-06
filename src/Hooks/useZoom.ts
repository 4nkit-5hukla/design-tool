import { useMemo, useState } from "react";
import { UseZoomParams } from "Interfaces";

export const useZoom = ({ origin: { x, y } }: UseZoomParams) => {
  const [zoom, setZoom] = useState(100);
  const [stageX, setStageX] = useState(x);
  const [stageY, setStageY] = useState(y);

  const maximum = 250;

  const minimum = 20;

  const zoomIn = () => {
    setZoom(Math.min(maximum, zoom + 1));
  };

  const zoomOut = () => {
    setZoom(Math.max(minimum, zoom - 1));
  };

  const canZoomIn = useMemo(() => zoom < maximum, [zoom]);

  const canZoomOut = useMemo(() => zoom > minimum, [zoom]);

  return {
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    canZoomIn,
    canZoomOut,
    stageX,
    setStageX,
    stageY,
    setStageY,
  };
};
