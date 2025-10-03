import { useEffect, useState } from "react";

import { Box, Slider, TextField, Typography } from "@mui/material";

import { useAppState } from "Contexts/AppState";

export const StrokeWidth = ({
  strokeEnabled,
  selectedEl,
  updateElement,
}: any) => {
  const { toggleEditingData } = useAppState();
  const [strokeWidth, setStrokeWidth] = useState<number>(0);

  useEffect(() => {
    selectedEl && setStrokeWidth(selectedEl.strokeWidth);
  }, [selectedEl]);

  return (
    <Box display="flex" flexDirection="column" rowGap={1} marginBottom={0.75}>
      <Box alignItems="center" display="flex" justifyContent="space-between">
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
          value={strokeWidth}
          type="number"
          size="small"
          onChange={({ target: { value } }) => {
            setStrokeWidth(parseInt(value));
            updateElement(
              { ...selectedEl, strokeWidth: parseInt(value) },
              { saveHistory: false }
            );
          }}
          onFocus={() => toggleEditingData(true)}
          onBlur={() => toggleEditingData(false)}
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

                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                  m: 0,
                  WebkitAppearance: "none",
                },
              },
            },
          }}
        />
      </Box>
      <Slider
        getAriaLabel={() => "Stroke Width"}
        value={strokeWidth}
        disabled={!strokeEnabled}
        step={1}
        min={0}
        max={10}
        onChange={(event: Event, newValue: any) => {
          const value = newValue as number;
          updateElement(
            { ...selectedEl, strokeWidth: value },
            { saveHistory: false }
          );
          setStrokeWidth(value);
        }}
        onChangeCommitted={() => {
          updateElement({ ...selectedEl, strokeWidth });
        }}
        sx={{
          color: "#24272C4D",

          "&::before": {
            borderLeft: "1px solid #24272C4D",
            content: "''",
            display: "flex",
            height: "8px",
            left: "0",
            position: "absolute",
            top: "50%",
            transform: "translate(0, -50%)",
          },

          "& .MuiSlider-rail": {
            backgroundColor: "#24272C4D",
            height: "1px",
            opacity: 1,
          },

          "& .MuiSlider-track": {
            backgroundColor: "#12B0EE",
            borderRadius: 0,
            height: "3px",
          },

          "& .MuiSlider-thumb": {
            width: 18,
            height: 18,
            backgroundColor: "#EEF5F9",
            border: "1px solid",

            "&:after": {
              width: 18,
              height: 18,
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
  );
};
