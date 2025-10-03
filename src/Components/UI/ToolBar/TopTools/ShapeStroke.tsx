/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Popover,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

import { useElementsContext } from "Contexts/Elements";

const ShapeStroke = ({
  id,
  anchorEl,
  open,
  onClose,
  strokeWidth,
  strokeType,
}: any) => {
  const { selectedEl, updateElement } = useElementsContext();
  const [outlineWidth, setOutlineWidth] = useState<number>(0);
  const [strokeStyle, setStrokeStyle] = useState<string>("solid");
  const changeStrokeStyle = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setStrokeStyle(value);
    updateElement({
      id: selectedEl.id,
      strokeType: value,
    });
  };
  const updateOutline = (event: Event, newValue: number | number[]) => {
    setOutlineWidth(newValue as number);
    updateElement(
      {
        id: selectedEl.id,
        strokeWidth: outlineWidth,
      },
      { saveHistory: false }
    );
  };
  const onCommit = () => {
    updateElement({
      id: selectedEl.id,
      strokeWidth: outlineWidth,
    });
  };

  useEffect(() => {
    if (strokeWidth) {
      setOutlineWidth(strokeWidth);
    }
    if (strokeType) {
      setStrokeStyle(strokeType);
    }
  }, [strokeWidth, strokeType]);

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiPopover-paper": {
          mt: 1,
          borderRadius: 0.25,
        },
      }}
    >
      <Box paddingX={1.25} width={300}>
        <Box padding={1.25} display="flex" flexDirection="column" rowGap={1}>
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "#24272CB3",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "16px",
              }}
            >
              {"Stroke Width"}
            </Typography>
            <TextField
              value={outlineWidth}
              size="small"
              onFocus={({ target }) => {
                target.select();
              }}
              onInput={({ target }: any) => {
                if (target.value.length > 3) {
                  target.value = 100;
                  return;
                }
                const value = parseInt(target.value);
                if (value > 100) {
                  target.value = 100;
                  return;
                }
              }}
              onChange={({ target: { value } }: any) => {
                if (value !== "") {
                  setOutlineWidth(parseInt(value));
                  updateElement(
                    {
                      id: selectedEl.id,
                      strokeWidth: parseInt(value),
                    },
                    { saveHistory: false }
                  );
                }
              }}
              type="number"
              autoFocus={true}
              inputProps={{
                // readOnly: true,
                step: 1,
                min: 0,
                max: 15,
                sx: { px: 1.25, py: 0, textAlign: "center" },
              }}
              sx={{
                maxWidth: 50,

                "& .MuiInputBase-root": {
                  backgroundColor: "#FFFFFF",
                  borderRadius: "3px",
                  color: "#24272C",

                  "&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#24272C4D",
                      borderWidth: 1,
                    },

                  "& .MuiInputBase-input": {
                    color: "#24272C",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "16px",
                    height: 25,
                    MozAppearance: "textfield",
                    px: 1,
                    py: 0,
                    textAlign: "center",

                    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                      {
                        m: 0,
                        WebkitAppearance: "none",
                      },
                  },
                },
              }}
            />
          </Box>
          <Slider
            aria-label="Zoom"
            value={outlineWidth}
            step={1}
            min={0}
            max={15}
            onChange={updateOutline}
            onChangeCommitted={onCommit}
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
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            columnGap={2}
            marginBottom={1.875}
          >
            <Typography
              variant="caption"
              display="block"
              sx={{
                color: "#24272CB3",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "16px",
              }}
            >
              {"Stroke Style"}
            </Typography>
            <TextField
              select
              value={strokeStyle}
              onChange={changeStrokeStyle}
              variant="outlined"
              SelectProps={{
                IconComponent: () => (
                  <Box
                    alignItems="center"
                    display="flex"
                    height="100%"
                    justifyContent="flex-start"
                    width={17}
                  >
                    <svg
                      width="7"
                      height="3"
                      viewBox="0 0 7 3"
                      fill="none"
                      xmlns="//www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.49984 3L6.53093 0H0.46875L3.49984 3Z"
                        fill="#66686B"
                      />
                    </svg>
                  </Box>
                ),
                sx: {
                  borderRadius: "3px",
                  height: "100%",

                  "&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: "#24272C4D",
                      borderWidth: 1,
                    },
                },
                MenuProps: {
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  sx: {
                    "& .MuiMenu-paper": {
                      borderRadius: 0.25,
                      marginTop: "-2px",
                      maxWidth: "140px",
                      width: "100%",

                      "& .MuiMenu-list": {
                        py: 0.5,
                        textAlign: "center",
                      },
                    },
                  },
                },
              }}
              sx={{
                height: "25px",
                maxWidth: "140px",
                width: "100%",

                "& .MuiOutlinedInput-input": {
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  py: 0,

                  "&.MuiSelect-select": {
                    pl: 1,
                    pr: 1,
                  },
                },
              }}
            >
              <MenuItem value={"solid"}>
                <svg
                  width="20"
                  height="2"
                  viewBox="0 0 20 2"
                  fill="none"
                  xmlns="//www.w3.org/2000/svg"
                >
                  <path d="M0 1H20" stroke="#000000" />
                </svg>
                <Box component="span" ml={1}>
                  {"Solid"}
                </Box>
              </MenuItem>
              <MenuItem value={"dash"}>
                <svg
                  width="20"
                  height="2"
                  viewBox="0 0 20 2"
                  fill="none"
                  xmlns="//www.w3.org/2000/svg"
                >
                  <path d="M0 1H20" stroke="#24272C" strokeDasharray="4 4" />
                </svg>
                <Box component="span" ml={1}>
                  {"Dash"}
                </Box>
              </MenuItem>
              <MenuItem value={"long-dash"}>
                <svg
                  width="20"
                  height="2"
                  viewBox="0 0 20 2"
                  fill="none"
                  xmlns="//www.w3.org/2000/svg"
                >
                  <path d="M0 1H20" stroke="#24272C" strokeDasharray="8 2" />
                </svg>
                <Box component="span" ml={1}>
                  {"Long Dash"}
                </Box>
              </MenuItem>
            </TextField>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
};

export default ShapeStroke;
