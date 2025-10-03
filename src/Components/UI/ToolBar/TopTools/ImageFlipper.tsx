import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";

import { useElementsContext } from "Contexts/Elements";

import { FlipHorizontal, FlipVertical } from "Assets/Icons";

import { flipImage } from "Components/UI/Elements/CropableImage";
import { flipClippedImage } from "Components/UI/Elements/ClippedImage";

const ImageFlipper = ({
  anchorEl,
  open,
  onClose,
  onClick,
}: {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onClick: () => void;
}) => {
  const { selectedEl, updateElement, setSelected, unSelect } =
    useElementsContext();
  const flipElement = (orientation: string = "horizontal") => {
    const { id, type } = selectedEl;
    if (type === "image") {
      updateElement(flipImage(selectedEl, orientation));
      return;
    }
    if (type === "clippedImage") {
      updateElement(flipClippedImage(selectedEl, orientation));
      return;
    }
    updateElement({
      id,
      ...(orientation === "horizontal"
        ? {
            scaleX: -selectedEl.scaleX,
          }
        : {
            scaleY: -selectedEl.scaleY,
          }),
    });
    unSelect();
    setTimeout(() => setSelected(id), 10);
  };

  return (
    <Menu
      id="flip-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      onClick={onClick}
      MenuListProps={{
        "aria-labelledby": "flip-menu",
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
              p: 2,
            },
          },
        },
      }}
    >
      <MenuItem
        onClick={() => {
          flipElement("horizontal");
        }}
      >
        <ListItemIcon>
          <FlipHorizontal />
        </ListItemIcon>
        <ListItemText>{"Flip Horizontal"}</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          flipElement("vertical");
        }}
      >
        <ListItemIcon>
          <FlipVertical />
        </ListItemIcon>
        <ListItemText>{"Flip Vertical"}</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default ImageFlipper;
