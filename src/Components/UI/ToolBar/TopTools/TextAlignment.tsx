/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { Box, ToggleButton, Popover, ToggleButtonGroup } from "@mui/material";
import {
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
} from "Assets/Icons";

import { useElementsContext } from "Contexts/Elements";

interface ElTextAlignmentProps {
  id: string | undefined;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const TextAlignment = ({
  id,
  anchorEl,
  open,
  onClose,
}: ElTextAlignmentProps) => {
  const { selectedEl, updateElement } = useElementsContext();
  const [textAlign, setTextAlign] = useState<string>("left");
  const handleAlignmentChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setTextAlign(newAlignment);
  };
  const saveAlign = useCallback(() => {
    if (selectedEl) {
      if (!selectedEl.lock) {
        if (textAlign && selectedEl.align !== textAlign) {
          updateElement({
            id: selectedEl.id,
            align: textAlign,
          });
        }
      }
    }
  }, [textAlign]);

  useEffect(() => {
    saveAlign();
  }, [saveAlign]);

  useEffect(() => {
    if (selectedEl) {
      if (selectedEl.align) {
        setTextAlign(selectedEl.align);
      }
    }
  }, [selectedEl]);

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      sx={{
        "& .MuiPopover-paper": {
          mt: 1,
          borderRadius: 0.25,
        },
      }}
    >
      <Box
        display="flex"
        maxWidth={400}
        component={ToggleButtonGroup}
        value={textAlign}
        exclusive
        onChange={handleAlignmentChange}
        aria-label="text alignment"
      >
        <Box
          borderRadius={0}
          columnGap={"5px"}
          component={ToggleButton}
          height="100%"
          paddingY={1}
          paddingX={1 + 0.75 / 4}
          justifyContent="center"
          minWidth="unset"
          value="left"
        >
          <TextAlignLeft />
        </Box>
        <Box
          borderRadius={0}
          columnGap={"5px"}
          component={ToggleButton}
          height="100%"
          paddingY={1}
          paddingX={1 + 0.75 / 4}
          justifyContent="center"
          minWidth="unset"
          value="center"
        >
          <TextAlignCenter />
        </Box>
        <Box
          borderRadius={0}
          columnGap={"5px"}
          component={ToggleButton}
          height="100%"
          paddingY={1}
          paddingX={1 + 0.75 / 4}
          justifyContent="center"
          minWidth="unset"
          value="right"
        >
          <TextAlignRight />
        </Box>
        <Box
          borderRadius={0}
          columnGap={"5px"}
          component={ToggleButton}
          height="100%"
          paddingY={1}
          paddingX={1 + 0.75 / 4}
          justifyContent="center"
          minWidth="unset"
          value="justify"
        >
          <TextAlignJustify />
        </Box>
      </Box>
    </Popover>
  );
};

export default TextAlignment;
