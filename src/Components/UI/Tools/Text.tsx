import { FormEvent, useState } from "react";
import {
  Box,
  FormControl,
  FilledInput,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import Konva from "konva";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

const Text = () => {
  const { canvas, setMultiSelectIds } = useAppState();
  const { addElement, setSelected, unSelect } = useElementsContext();
  const [textInput, setTextInput] = useState("");
  const addText = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (textInput === "") {
      return alert("Please enter something to add");
    }
    const temp: { text: Konva.Text | undefined } = {
      text: new Konva.Text({
        text: textInput,
        fontSize: 100,
        fontFamily: "Arial",
      }),
    };
    if (temp.text) {
      const [element] = addElement<Konva.ShapeConfig>({
        type: "text",
        text: textInput,
        fontFamily: "Arial",
        fontStyle: "normal",
        fontSize: 100,
        textDecoration: "",
        align: "left",
        fill: "#000000",
        letterSpacing: 0,
        lineHeight: 1,
        opacity: 1,
        strokeEnabled: false,
        stroke: "#000000",
        strokeWidth: 2,
        shadowEnabled: false,
        shadowColor: "#000000",
        shadowBlur: 5,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowOpacity: 0.5,
        y: canvas.height / 2 - temp.text.height() / 2,
        x: canvas.width / 2 - temp.text.width() / 2,
      });
      if (element.id) {
        const { id } = element;
        delete temp.text;
        setTextInput("");
        setSelected(id);
        setMultiSelectIds(new Set());
      }
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        paddingX={1}
        paddingTop={1.5}
        component="form"
        onSubmit={addText}
        noValidate
      >
        <FormControl
          className="search-box"
          variant="filled"
          sx={{ width: "100%", height: "42px", mb: 1 }}
        >
          <FilledInput
            placeholder="Input Your Text Here"
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  color: "#24272C80",
                  mt: "0 !important",
                }}
              >
                <IconButton type="submit" aria-label="Add Text">
                  <Add />
                </IconButton>
              </InputAdornment>
            }
            value={textInput}
            onChange={({ target: { value } }) => setTextInput(value)}
            inputProps={{
              sx: { py: 0 },
            }}
            onFocus={() => unSelect()}
            disableUnderline={true}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              color: "#24272C80",
              height: "100%",

              "&:hover,&.Mui-focused": {
                backgroundColor: "#ffffff",
              },
            }}
          />
        </FormControl>
      </Box>
    </Box>
  );
};

export default Text;
