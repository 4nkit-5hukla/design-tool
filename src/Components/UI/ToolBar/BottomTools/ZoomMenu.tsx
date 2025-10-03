import { ListItemText, Menu, MenuItem } from "@mui/material";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

const ZoomMenu = ({
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
  const { canvas, containerRef } = useAppState();
  const { zoom, setZoom } = useElementsContext();
  const applyZoom = (value: string | number) => {
    if (value === "fit") {
      const { current: containerEl } = containerRef;
      const maxSide = Math.max(canvas.height, canvas.width);
      const minContainerSide = Math.min(
        containerEl.clientHeight,
        containerEl.clientWidth
      );
      setZoom(Math.ceil((minContainerSide / maxSide) * 100) - 5);
    } else {
      setZoom(value);
    }
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
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      sx={{
        "& .MuiMenu-paper": {
          borderRadius: 0.25,
          boxShadow: "0px -6px 10px 0px #00000026",

          "& .MuiMenu-list": {
            p: 0,

            "& .MuiMenuItem-root": {
              px: 2,
              py: 1,
            },
          },
        },
      }}
    >
      {[
        { value: 500, label: `500%` },
        { value: 300, label: `300%` },
        { value: 200, label: `200%` },
        { value: 125, label: `125%` },
        { value: 100, label: `100%` },
        { value: 75, label: `75%` },
        { value: 50, label: `50%` },
        { value: 25, label: `25%` },
        { value: 10, label: `10%` },
        { value: "fit", label: `Fit` },
      ].map(({ value, label }, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            applyZoom(value);
          }}
          selected={value === zoom}
        >
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ZoomMenu;
