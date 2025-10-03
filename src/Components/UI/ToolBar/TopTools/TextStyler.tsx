/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";

import { useElementsContext } from "Contexts/Elements";

interface TextStyleProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onClick: () => void;
}

const TextStyler = ({ anchorEl, open, onClose, onClick }: TextStyleProps) => {
  const { updateElement, selectedEl, setSelected, unSelect } =
    useElementsContext();
  const [fontStyle, setFontStyle] = useState("normal");
  const [textDecoration, setTextDecoration] = useState("");
  const updateFontStyle = (style: string) => {
    if (selectedEl) {
      if (!selectedEl.lock) {
        switch (fontStyle) {
          case "italic bold":
            {
              const id = selectedEl.id;
              setFontStyle(fontStyle.replace(style, "").trim());
              updateElement({
                id: selectedEl.id,
                fontStyle: fontStyle.replace(style, "").trim(),
              });
              unSelect();
              setTimeout(() => setSelected(id), 10);
            }
            break;
          case "bold":
            {
              const id = selectedEl.id;
              setFontStyle(fontStyle === style ? "normal" : "italic bold");
              updateElement({
                id: selectedEl.id,
                fontStyle: fontStyle === style ? "normal" : "italic bold",
              });
              unSelect();
              setTimeout(() => setSelected(id), 10);
            }
            break;
          case "italic":
            {
              const id = selectedEl.id;
              updateElement({
                id: selectedEl.id,
                fontStyle: fontStyle === style ? "normal" : "italic bold",
              });
              unSelect();
              setTimeout(() => setSelected(id), 10);
            }
            break;
          case "normal":
          default:
            {
              const id = selectedEl.id;
              setFontStyle(style);
              updateElement({
                id: selectedEl.id,
                fontStyle: style,
              });
              unSelect();
              setTimeout(() => setSelected(id), 10);
            }
            break;
        }
      }
    }
  };

  useEffect(() => {
    if (selectedEl && selectedEl.type === "text") {
      setFontStyle(selectedEl.fontStyle);
      setTextDecoration(selectedEl.textDecoration);
    }
  }, [selectedEl]);

  return (
    <Menu
      id="text-style-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClick}
      MenuListProps={{
        "aria-labelledby": "text-style-menu",
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiMenu-paper": {
          mt: 1,
          borderRadius: 0.25,

          "& .MuiMenu-list": {
            p: 0,

            "& .MuiMenuItem-root": {
              py: 1,
              px: 2,

              "& .MuiListItemIcon-root": {
                justifyContent: "center",
                fontSize: 24,
                lineHeight: "28px",
              },
            },
          },
        },
      }}
    >
      <MenuItem
        onClick={() => updateFontStyle("bold")}
        selected={fontStyle.includes("bold")}
      >
        <ListItemIcon sx={{ fontWeight: 900 }}>{"B"}</ListItemIcon>
        <ListItemText>{"Bold"}</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => updateFontStyle("italic")}
        selected={fontStyle.includes("italic")}
      >
        <ListItemIcon sx={{ fontStyle: "italic", fontWeight: 900 }}>
          {"I"}
        </ListItemIcon>
        <ListItemText>{"Italic"}</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          if (selectedEl && !selectedEl.lock) {
            setTextDecoration((textDecoration) =>
              textDecoration === "underline" ? "" : "underline"
            );
            updateElement({
              id: selectedEl.id,
              textDecoration: textDecoration === "underline" ? "" : "underline",
            });
          }
        }}
        selected={textDecoration === "underline"}
      >
        <ListItemIcon sx={{ fontWeight: 900, textDecoration: "underline" }}>
          {"U"}
        </ListItemIcon>
        <ListItemText>{"Underline"}</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default TextStyler;
