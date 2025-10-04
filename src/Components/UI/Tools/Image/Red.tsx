import { FC, useEffect, useState } from "react";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

const Red: FC = () => {
  const { toggleEditingData } = useAppState();
  const { selectedEl, updateElement } = useElementsContext();
  const [rgb, setRGB] = useState<boolean>(false);
  const [red, setRed] = useState<number>(0);

  useEffect(() => {
    if (selectedEl) {
      setRGB(selectedEl.rgb);
      setRed(selectedEl.red);
    }
  }, [selectedEl]);

  return (
    <Box display="flex" flexDirection="column" rowGap={1} marginBottom={0.75}>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        marginBottom={0.5}
      >
        <Typography
          variant="caption"
          display="block"
          sx={{
            color: "#24272CB3",
            fontSize: "14px",
            fontWeight: 600,
            lineHeight: "16px",
          }}
        >
          {"RGB"}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={rgb}
              onChange={({ target: { checked } }) => {
                updateElement({ ...selectedEl, rgb: checked });
                setRGB(checked);
              }}
              inputProps={{ "aria-label": "enable-rgb" }}
            />
          }
          label="Enable"
          sx={{
            color: "#24272CB3",
            fontSize: "12px",
            fontWeight: 500,
            lineHeight: "14px",
          }}
        />
      </Box>
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
          {"Red"}
        </Typography>
        <TextField
          value={red}
          type="number"
          size="small"
          onChange={({ target: { value } }) => {
            setRed(parseInt(value) ? parseInt(value) : 0);
            updateElement(
              { ...selectedEl, red: parseInt(value) ? parseInt(value) : 0 },
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
        getAriaLabel={() => "Red"}
        value={red}
        step={1}
        min={0}
        max={255}
        onChange={(event: Event, newValue: number | number[]) => {
          const value = Array.isArray(newValue) ? newValue[0] : newValue;
          updateElement({ ...selectedEl, red: value }, { saveHistory: false });
          setRed(value);
        }}
        onChangeCommitted={() => {
          updateElement({ ...selectedEl, red });
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

export default Red;
