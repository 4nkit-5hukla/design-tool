import { Box, Button, Chip, Popover, Stack, Typography } from "@mui/material";
import {
  AlignBottom,
  AlignCenter,
  AlignLeft,
  AlignMiddle,
  AlignRight,
  AlignTop,
  PositionBackward,
  PositionForward,
  PositionToBack,
  PositionToFront,
} from "Assets/Icons";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { alignImage } from "Components/UI/Elements/CropableImage";
import { alignClippedImage } from "Components/UI/Elements/ClippedImage";
import { alignMultiSelect } from "Hooks";

interface ElPositionProps {
  id: string | undefined;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const ElementPositioner = ({
  id,
  anchorEl,
  open,
  onClose,
}: ElPositionProps) => {
  const { canvas, multiSelectIds } = useAppState();
  const {
    selected,
    selectedEl,
    updateElement,
    toFront,
    toForward,
    toBack,
    toBackward,
    layer,
    elements,
    updateElements,
  } = useElementsContext();
  const movePosition = (pos: string) => {
    if (selected || multiSelectIds.size > 0) {
      switch (pos) {
        case "backward":
          return toBackward(selected ?? '');
        case "back":
          return toBack(selected ?? '');
        case "forward":
          return toForward(selected ?? '');
        case "front":
        default:
          return toFront(selected ?? '');
      }
    }
  };
  const alignEL = (align: string) => {
    if (multiSelectIds.size > 0) {
      alignMultiSelect(
        layer.getStage(),
        align,
        elements,
        updateElements,
        multiSelectIds
      );
      return;
    }
    if (!selectedEl.lock) {
      const { id, type }: { id: string; type: string } = selectedEl;
      const selectedElement = layer.findOne(`#${selectedEl.id}`);

      switch (type) {
        case "text":
          switch (align) {
            case "top":
              updateElement({
                id,
                y: 0,
              });
              break;
            case "middle":
              updateElement({
                id,
                y: canvas.height / 2 - selectedElement.height() / 2,
              });
              break;
            case "bottom":
              updateElement({
                id,
                y: canvas.height - selectedElement.height(),
              });
              break;
            case "left":
              updateElement({
                id,
                x: 0,
              });
              break;
            case "center":
              updateElement({
                id,
                x: canvas.width / 2 - selectedElement.width() / 2,
              });
              break;
            case "right":
              updateElement({
                id,
                x: canvas.width - selectedElement.width(),
              });
              break;
          }
          break;
        case "path":
          switch (align) {
            case "top":
              updateElement({
                id,
                y: Math.round(
                  (selectedElement.height() * selectedElement.scaleY()) / 2
                ),
              });
              break;
            case "middle":
              updateElement({
                id,
                y: Math.round(canvas.height / 2),
              });
              break;
            case "bottom":
              updateElement({
                id,
                y: Math.round(
                  canvas.height -
                    (selectedElement.height() * selectedElement.scaleY()) / 2
                ),
              });
              break;
            case "left":
              updateElement({
                id,
                x: Math.round(
                  (selectedElement.width() * selectedElement.scaleX()) / 2
                ),
              });
              break;
            case "center":
              updateElement({
                id,
                x: Math.round(canvas.width / 2),
              });
              break;
            case "right":
              updateElement({
                id,
                x: Math.round(
                  canvas.width -
                    (selectedElement.width() * selectedElement.scaleX()) / 2
                ),
              });
              break;
          }
          break;
        case "flat-svg":
          switch (align) {
            case "top":
              updateElement({
                id,
                y: Math.round(
                  (selectedElement.height() * selectedElement.scaleY()) / 2
                ),
              });
              break;
            case "middle":
              updateElement({
                id,
                y: Math.round(canvas.height / 2),
              });
              break;
            case "bottom":
              updateElement({
                id,
                y: Math.round(
                  canvas.height -
                    (selectedElement.height() * selectedElement.scaleY()) / 2
                ),
              });
              break;
            case "left":
              updateElement({
                id,
                x: Math.round(
                  (selectedElement.width() * selectedElement.scaleX()) / 2
                ),
              });
              break;
            case "center":
              updateElement({
                id,
                x: Math.round(canvas.width / 2),
              });
              break;
            case "right":
              updateElement({
                id,
                x: Math.round(
                  canvas.width -
                    (selectedElement.width() * selectedElement.scaleX()) / 2
                ),
              });
              break;
          }
          break;
        case "image":
          updateElement(alignImage(selectedEl, canvas, align));
          break;
        case "clippedImage":
          updateElement(alignClippedImage(selectedEl, canvas, align));
          break;
      }
    }
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        "& .MuiPopover-paper": {
          mt: 1,
          borderRadius: 0.25,
        },
      }}
    >
      <Box display="flex" flexDirection="column" paddingX={3} maxWidth={400}>
        <Box padding={1} borderBottom="1px solid #97979733">
          <Typography
            variant="caption"
            display="block"
            sx={{
              color: "#24272CB3",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "14px",
              mb: 1.25,
            }}
          >
            {"Position"}
          </Typography>
          <Box display="flex" flexWrap="wrap">
            <Box
              alignItems="center"
              columnGap="10px"
              display="flex"
              flex="1 1 50%"
              width="50%"
            >
              <Box
                color="#24272CB3"
                borderRadius={0}
                columnGap={"3px"}
                component={Button}
                padding={1}
                justifyContent="space-between"
                minWidth="unset"
                onClick={() => movePosition("backward")}
              >
                <PositionBackward />
                {"Backward"}
              </Box>
              <Chip
                label={`[`}
                size="small"
                sx={{
                  backgroundColor: "#E5F5FF",
                  borderRadius: 0,
                  color: "#24272CB3",
                }}
              />
            </Box>
            <Box
              alignItems="center"
              columnGap="10px"
              display="flex"
              flex="1 1 50%"
              width="50%"
            >
              <Box
                color="#24272CB3"
                borderRadius={0}
                columnGap={"3px"}
                component={Button}
                padding={1}
                justifyContent="space-between"
                minWidth="unset"
                onClick={() => movePosition("forward")}
              >
                <PositionForward />
                {"Forward"}
              </Box>
              <Chip
                label={`]`}
                size="small"
                sx={{
                  backgroundColor: "#E5F5FF",
                  borderRadius: 0,
                  color: "#24272CB3",
                }}
              />
            </Box>
            <Box
              alignItems="center"
              columnGap="10px"
              display="flex"
              flex="1 1 50%"
              width="50%"
            >
              <Box
                color="#24272CB3"
                borderRadius={0}
                columnGap={"3px"}
                component={Button}
                padding={1}
                justifyContent="space-between"
                minWidth="unset"
                onClick={() => movePosition("back")}
              >
                <PositionToBack />
                {"To Back"}
              </Box>
              <Chip
                label={`Ctrl + [`}
                size="small"
                sx={{
                  backgroundColor: "#E5F5FF",
                  borderRadius: 0,
                  color: "#24272CB3",
                }}
              />
            </Box>
            <Box
              alignItems="center"
              columnGap="10px"
              display="flex"
              flex="1 1 50%"
              width="50%"
            >
              <Box
                color="#24272CB3"
                borderRadius={0}
                columnGap={"3px"}
                component={Button}
                padding={1}
                justifyContent="space-between"
                minWidth="unset"
                onClick={() => movePosition("front")}
              >
                <PositionToFront />
                {"To Front"}
              </Box>
              <Chip
                label={`Ctrl + ]`}
                size="small"
                sx={{
                  backgroundColor: "#E5F5FF",
                  borderRadius: 0,
                  color: "#24272CB3",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box padding={1}>
          <Typography
            variant="caption"
            display="block"
            sx={{
              color: "#24272CB3",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "14px",
              mb: 1.25,
            }}
          >
            {"Alignment"}
          </Typography>
          <Box display="flex" flexWrap="wrap" columnGap="2%">
            <Box
              alignItems="center"
              columnGap="10px"
              display="flex"
              flex="1 1 49%"
              width="49%"
            >
              <Stack spacing={1} width="100%">
                <Box
                  color="#24272CB3"
                  borderRadius={0}
                  columnGap={"3px"}
                  component={Button}
                  padding={1}
                  justifyContent="flex-start"
                  minWidth="unset"
                  onClick={() => alignEL("top")}
                >
                  <AlignTop />
                  {"Top"}
                </Box>
                <Box
                  color="#24272CB3"
                  borderRadius={0}
                  columnGap={"3px"}
                  component={Button}
                  padding={1}
                  justifyContent="flex-start"
                  minWidth="unset"
                  onClick={() => alignEL("middle")}
                >
                  <AlignMiddle />
                  {"Middle"}
                </Box>
                <Box
                  color="#24272CB3"
                  borderRadius={0}
                  columnGap={"3px"}
                  component={Button}
                  padding={1}
                  justifyContent="flex-start"
                  minWidth="unset"
                  onClick={() => alignEL("bottom")}
                >
                  <AlignBottom />
                  {"Bottom"}
                </Box>
              </Stack>
            </Box>
            <Box
              alignItems="center"
              columnGap="10px"
              display="flex"
              flex="1 1 49%"
              width="49%"
            >
              <Stack spacing={1} width="100%">
                <Box
                  color="#24272CB3"
                  borderRadius={0}
                  columnGap={"3px"}
                  component={Button}
                  padding={1}
                  justifyContent="flex-start"
                  minWidth="unset"
                  onClick={() => alignEL("left")}
                >
                  <AlignLeft />
                  {"Left"}
                </Box>
                <Box
                  color="#24272CB3"
                  borderRadius={0}
                  columnGap={"3px"}
                  component={Button}
                  padding={1}
                  justifyContent="flex-start"
                  minWidth="unset"
                  onClick={() => alignEL("center")}
                >
                  <AlignCenter />
                  {"Center"}
                </Box>
                <Box
                  color="#24272CB3"
                  borderRadius={0}
                  columnGap={"3px"}
                  component={Button}
                  padding={1}
                  justifyContent="flex-start"
                  minWidth="unset"
                  onClick={() => alignEL("right")}
                >
                  <AlignRight />
                  {"Right"}
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
};

export default ElementPositioner;
