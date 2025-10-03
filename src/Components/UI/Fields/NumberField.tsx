import { Dispatch, SetStateAction, useState } from "react";
import { Box, Button, TextField } from "@mui/material";

import { useAppState } from "Contexts/AppState";

interface IF_NumberField {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  min: number;
  max: number;
  step: number;
  editableInput?: boolean;
  disabled: boolean;
}

const NumberField = ({
  value,
  setValue,
  min = 1,
  max = Infinity,
  step = 1,
  editableInput = true,
  disabled,
}: IF_NumberField) => {
  const { toggleEditingData } = useAppState();
  const [timeout, updateTimeOut] = useState<any>(null);
  const increaseValue = (speed: number) => {
    setValue((oldValue: number) => (oldValue < max ? oldValue + step : max));
    updateTimeOut(setTimeout(() => increaseValue(speed * 0.8), speed));
  };
  const decreaseValue = (speed: number) => {
    setValue((oldValue: number) => (oldValue > min ? oldValue - step : min));
    updateTimeOut(setTimeout(() => decreaseValue(speed * 0.8), speed));
  };
  const buttonPress = (doAction: any, speed: number = 100) => doAction(speed);
  const buttonRelease = () => clearTimeout(timeout);

  return (
    <Box alignItems="center" display="flex" height="100%">
      <Button
        type="button"
        variant="outlined"
        onMouseDown={() => buttonPress(decreaseValue)}
        onMouseUp={() => timeout && buttonRelease()}
        disabled={disabled}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "3px 0 0 3px",
          borderColor: "#24272C4D",
          borderRight: "none",
          borderWidth: 1,
          color: "#24272CB3",
          minWidth: 24,
          px: 1,
          py: 0.5,
          height: "100%",

          "&:hover": {
            backgroundColor: "#ffffff",
            borderColor: "#24272C4D",
            borderRight: "none",
            borderWidth: 1,
          },
        }}
      >
        {"-"}
      </Button>
      <TextField
        variant="outlined"
        inputProps={{
          "aria-label": "Number",
          readOnly: !editableInput,
          type: "number",
        }}
        disabled={disabled}
        onFocus={() => toggleEditingData(true)}
        onBlur={() => toggleEditingData(false)}
        InputProps={{
          // disableUnderline: true,
          sx: {
            borderRadius: 0,
            height: "100%",

            "&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#24272C4D",
                borderWidth: 1,
              },

            "& .MuiInputBase-input": {
              p: 0,
              MozAppearance: "textfield",
              textAlign: "center",

              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                m: 0,
                WebkitAppearance: "none",
              },
            },
          },
        }}
        value={value}
        onChange={({ target: { value } }) =>
          setValue(parseFloat(value) ? parseFloat(value) : 100)
        }
        sx={{
          height: "100%",
          width: 60,
        }}
      />
      <Button
        type="button"
        className="btn-updater"
        variant="outlined"
        onMouseDown={() => buttonPress(increaseValue)}
        onMouseUp={() => timeout && buttonRelease()}
        disabled={disabled}
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "0 3px 3px 0",
          borderColor: "#24272C4D",
          borderLeft: "none",
          borderWidth: 1,
          color: "#24272CB3",
          minWidth: 24,
          px: 1,
          py: 0.5,
          height: "100%",

          "&:hover": {
            backgroundColor: "#ffffff",
            borderColor: "#24272C4D",
            borderLeft: "none",
            borderWidth: 1,
          },
        }}
      >
        {"+"}
      </Button>
    </Box>
  );
};

export default NumberField;
