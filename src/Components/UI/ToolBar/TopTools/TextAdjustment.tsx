import { useEffect, useState } from "react";
import { Box, Popover, Slider, TextField, Typography } from "@mui/material";

import { useElementsContext } from "Contexts/Elements";

interface TextAdjustmentProps {
  id: string | undefined;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const TextAdjustment = ({
  id,
  anchorEl,
  open,
  onClose,
}: TextAdjustmentProps) => {
  const { updateElement, selectedEl } = useElementsContext();
  const [letterSpacing, setLetterSpacing] = useState<number>(0);
  const [lineHeight, setLineHeight] = useState<number>(1);
  const onCommit = () => {
    updateElement({
      id: selectedEl.id,
      ...{ letterSpacing, lineHeight },
    });
  };

  useEffect(() => {
    if (selectedEl && selectedEl.type === "text") {
      setLetterSpacing(selectedEl.letterSpacing);
      setLineHeight(selectedEl.lineHeight);
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
      <Box paddingX={1.25} width={270}>
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
              {"Letter Spacing"}
            </Typography>
            <TextField
              value={letterSpacing}
              size="small"
              onChange={({ target: { value } }) => {
                setLetterSpacing(parseInt(value));
                updateElement({
                  id: selectedEl.id,
                  letterSpacing: parseInt(value),
                });
              }}
              inputProps={{
                // readOnly: true,
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
            aria-label="Letter Spacing"
            value={letterSpacing}
            step={1}
            min={-15}
            max={100}
            onChange={(event: Event, newValue: number | number[]) => {
              setLetterSpacing(newValue as number);
              updateElement(
                {
                  id: selectedEl.id,
                  letterSpacing: newValue as number,
                },
                {
                  saveHistory: false,
                }
              );
            }}
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
        </Box>
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
              {"Line Height"}
            </Typography>
            <TextField
              value={lineHeight}
              size="small"
              onChange={({ target: { value } }) => {
                setLineHeight(parseInt(value));
                updateElement({
                  id: selectedEl.id,
                  lineHeight: parseInt(value),
                });
              }}
              inputProps={{
                // readOnly: true,
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
            aria-label="Line Height"
            value={lineHeight}
            step={0.01}
            min={0.5}
            max={2.5}
            onChange={(event: Event, newValue: number | number[]) => {
              setLineHeight(newValue as number);
              updateElement(
                {
                  id: selectedEl.id,
                  lineHeight: newValue as number,
                },
                {
                  saveHistory: false,
                }
              );
            }}
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
        </Box>
      </Box>
    </Popover>
  );
};

export default TextAdjustment;
