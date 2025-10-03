import { useEffect, useState } from "react";

import { Box, Slider, TextField, Typography } from "@mui/material";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

const Saturation = () => {
  const { toggleEditingData } = useAppState();
  const { selectedEl, updateElement } = useElementsContext();
  const [saturation, setSaturation] = useState<number>(0);

  useEffect(() => {
    selectedEl && setSaturation(selectedEl.saturation * 10);
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
          {"Saturation"}
        </Typography>
        <TextField
          value={saturation}
          type="number"
          size="small"
          onChange={({ target: { value } }) => {
            setSaturation(parseInt(value) ? parseInt(value) : 0);
            updateElement(
              {
                ...selectedEl,
                saturation: parseInt(value) ? parseInt(value) / 10 : 0,
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
                px: 1.25,
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
        getAriaLabel={() => "Brightness"}
        value={[
          saturation < 0 ? saturation : 0,
          saturation > 0 ? saturation : 0,
        ]}
        step={0.5}
        min={-10}
        max={10}
        className={saturation < 0 ? "value-negative" : "value-positive"}
        onChange={(event: Event, newValue: any) => {
          const value =
            (newValue[0] as number) !== 0
              ? (newValue[0] as number)
              : (newValue[1] as number);
          updateElement(
            { ...selectedEl, saturation: value / 10 },
            { saveHistory: false }
          );
          setSaturation(value);
        }}
        onChangeCommitted={() => {
          updateElement({ ...selectedEl, saturation: saturation / 10 });
        }}
        sx={{
          color: "#24272C4D",

          "&::before": {
            borderLeft: "1px solid #24272C4D",
            content: "''",
            display: "flex",
            height: "8px",
            left: "50%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
          },

          "&.value-negative": {
            "& .MuiSlider-thumb": {
              "&+.MuiSlider-thumb": {
                display: "none",
              },
            },
          },

          "&.value-positive": {
            "& .MuiSlider-thumb": {
              display: "none",

              "&+.MuiSlider-thumb": {
                display: "flex",
              },
            },
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

export default Saturation;
