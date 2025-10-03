/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Popover, Slider, TextField, Typography } from "@mui/material";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

interface ElOpacityProps {
  id: string | undefined;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  opacity: number;
}

const ElementOpacity = ({
  id,
  anchorEl,
  open,
  onClose,
  opacity,
}: ElOpacityProps) => {
  const { toggleEditingData, multiSelectIds } = useAppState();
  const { selectedEl, updateElement, updateElements, elements, setElements } =
    useElementsContext();
  const [transparency, setTransparency] = useState<number>(opacity * 100);
  const updateTransparency = (
    event: Event | null,
    newValue: number | number[]
  ) => {
    let value = newValue as number;
    if (value === 0) value = 0.00001;
    setTransparency(value);
    if (multiSelectIds.size > 0) {
      setElements(
        elements.map((e) => {
          if (!multiSelectIds.has(e.id)) return e;
          const opacity = e.opacity ? e.opacity.valueOf() : 100;
          return {
            ...e,
            opacity: (opacity * value) / transparency,
          };
        })
      );
      return;
    }
    updateElement(
      {
        id: selectedEl.id,
        opacity: value / 100,
      },
      { saveHistory: false }
    );
  };
  const onCommit = () => {
    if (multiSelectIds.size > 0) {
      updateElements(elements);
    } else {
      updateElement({
        id: selectedEl.id,
        opacity: transparency / 100,
      });
    }
  };

  useEffect(() => {
    if (opacity) {
      setTransparency(opacity * 100);
    }
  }, [opacity]);

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
              {"Transparency"}
            </Typography>
            <TextField
              value={Math.round(transparency)}
              size="small"
              onFocus={({ target }) => {
                target.select();
                toggleEditingData(true);
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
                  updateTransparency(null, parseInt(value));
                }
              }}
              onBlur={() => {
                toggleEditingData(false);
              }}
              type="number"
              autoFocus={true}
              inputProps={{
                // readOnly: true,
                step: 1,
                min: 0,
                max: 100,
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
            value={Math.round(transparency)}
            step={1}
            min={0}
            max={100}
            onChange={updateTransparency}
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

export default ElementOpacity;
