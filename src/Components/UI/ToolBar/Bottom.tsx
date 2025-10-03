import { Fragment, MouseEvent, useState } from "react";
import { Box, Button, Badge, Slider } from "@mui/material";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { useFullScreen } from "Hooks";
import {
  FitScreen,
  FullScreenOn,
  FullScreenOff,
  Layers,
  Zoom,
} from "Assets/Icons";
import ZoomMenu from "./BottomTools/ZoomMenu";

const Bottom = () => {
  const { canvas, containerRef, rootRef } = useAppState();
  const { zoom, elements, setZoom } = useElementsContext();
  const [zoomEl, setZoomEl] = useState<null | HTMLElement>(null);
  const { fullScreen, toggle } = useFullScreen(rootRef);
  const openZoomMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setZoomEl(event.currentTarget);
  };
  const closeZoomMenu = () => {
    setZoomEl(null);
  };
  const doFitScreen = () => {
    const { current: containerEl } = containerRef;
    const maxSide = Math.max(canvas.height, canvas.width);
    const minContainerSide = Math.min(
      containerEl.clientHeight,
      containerEl.clientWidth
    );
    const newZoom = Math.ceil((minContainerSide / maxSide) * 100) - 5;
    setZoom(zoom !== newZoom ? (newZoom > 10 ? newZoom : 10) : 100);
  };
  const zoomChange = (_: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  return (
    <Fragment>
      <Box bgcolor="#FFFFFF" display="flex" justifyContent="flex-end">
        <Box
          alignItems="center"
          columnGap="20px"
          display="flex"
          height={34}
          width={425}
          justifyContent="space-between"
          zIndex={1}
        >
          <Box
            alignItems="center"
            columnGap="10px"
            display="flex"
            height={"100%"}
            flex="1 0 0"
          >
            <Box
              borderRadius={"5px 0 0 0"}
              columnGap={"2px"}
              component={Button}
              height="100%"
              paddingY={0}
              paddingLeft={2}
              minWidth={"76px"}
              justifyContent="space-between"
              onClick={openZoomMenu}
            >
              <Zoom />
              <Box
                component="span"
                color="#636770"
                fontWeight={400}
                fontSize={12}
                lineHeight={"14px"}
              >{`${zoom}%`}</Box>
            </Box>
            <Slider
              aria-label="Zoom"
              value={zoom}
              step={1}
              // step={null}
              min={10}
              max={500}
              marks={[
                // {
                //   value: 10,
                // },
                // {
                //   value: 25,
                // },
                // {
                //   value: 50,
                // },
                // {
                //   value: 75,
                // },
                {
                  value: 100,
                },
                // {
                //   value: 125,
                // },
                // {
                //   value: 150,
                // },
                // {
                //   value: 175,
                // },
                // {
                //   value: 200,
                // },
                // {
                //   value: 225,
                // },
                // {
                //   value: 250,
                // },
              ]}
              onChange={zoomChange}
              sx={{
                color: "#636770",

                "& .MuiSlider-rail": {
                  height: "1px",
                },

                "& .MuiSlider-track": {
                  height: "2px",
                  border: "none",
                },

                "& .MuiSlider-thumb": {
                  width: 14,
                  height: 14,
                  backgroundColor: "#636770",

                  "&:after": {
                    width: 14,
                    height: 14,
                  },

                  "&:before": {
                    boxShadow: "none",
                  },

                  "&:hover, &.Mui-focusVisible, &.Mui-active": {
                    boxShadow: "none",
                  },
                },
              }}
            />
          </Box>
          <Box display="flex" height={"100%"} flex="0 1 0" paddingRight={2}>
            <Box
              component={Button}
              borderRadius={0}
              minWidth="unset"
              height="100%"
              onClick={doFitScreen}
            >
              <FitScreen />
            </Box>
            <Box
              component={Button}
              borderRadius={0}
              minWidth="unset"
              height="100%"
              onClick={() => toggle()}
            >
              {fullScreen ? <FullScreenOff /> : <FullScreenOn />}
            </Box>
            <Box
              component={Button}
              borderRadius={0}
              minWidth="unset"
              height="100%"
            >
              <Badge
                badgeContent={elements.length}
                sx={{
                  backgroundColor: "transparent",
                  color: "#636770",

                  "& .MuiBadge-badge": {
                    justifyContent: "flex-end",
                    p: 0,
                    minWidth: 16,
                  },
                }}
              >
                <Layers />
              </Badge>
            </Box>
          </Box>
        </Box>
      </Box>
      <ZoomMenu
        anchorEl={zoomEl}
        open={Boolean(zoomEl)}
        onClose={closeZoomMenu}
        onClick={closeZoomMenu}
      />
    </Fragment>
  );
};

export default Bottom;
