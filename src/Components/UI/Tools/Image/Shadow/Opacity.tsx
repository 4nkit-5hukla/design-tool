import { FC, useEffect, useState } from "react";

import { Box, Slider, TextField, Typography } from "@mui/material";

import { useAppState } from "Contexts/AppState";
import { ShadowProps } from "Interfaces/ComponentProps";

export const Opacity: FC<ShadowProps> = ({ shadowEnabled, selectedEl, updateElement }) => {
  const { toggleEditingData } = useAppState();
  const [opacity, setOpacity] = useState<number>(0);

  useEffect(() => {
    selectedEl && setOpacity(selectedEl.shadowOpacity * 100);
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
          {"Opacity"}
        </Typography>
        <TextField
          value={opacity}
          type="number"
          size="small"
          onChange={({ target: { value } }) => {
            setOpacity(parseInt(value) ? parseInt(value) : 0);
            updateElement(
              {
                ...selectedEl,
                shadowOpacity: parseInt(value) ? parseInt(value) / 100 : 0,
              },
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
        getAriaLabel={() => "Opacity"}
        disabled={!shadowEnabled}
        value={opacity}
        step={1}
        min={0}
        max={100}
        onChange={(event: Event, newValue: number | number[]) => {
          const value = Array.isArray(newValue) ? newValue[0] : newValue;
          updateElement(
            { ...selectedEl, shadowOpacity: value / 100 },
            { saveHistory: false }
          );
          setOpacity(value);
        }}
        onChangeCommitted={() => {
          updateElement({ ...selectedEl, shadowOpacity: opacity / 100 });
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

            // "&:last-child":{
            //   display: "none",
            // },

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
