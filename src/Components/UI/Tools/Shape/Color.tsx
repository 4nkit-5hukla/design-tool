import { FC, Fragment, MouseEvent, useState } from "react";
import {
  Box,
  Button,
  ToggleButton,
  Typography,
  Popover,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ChromePicker, ColorResult } from "react-color";
import { Close, Cached } from "@mui/icons-material";

import { swatchColor } from "Configs";
import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

const ShapeColor: FC = () => {
  const [addColorEl, setAddColorEl] = useState<HTMLButtonElement | null>(null);
  const { currentColor, setEditTool, setCurrentColor, toggleEditSelected } =
    useAppState();
  const { designColors, updateElement, selectedEl } = useElementsContext();
  const openAddColor = (event: MouseEvent<HTMLButtonElement>) => {
    setAddColorEl(event.currentTarget);
  };
  const closeAddColor = () => {
    setAddColorEl(null);
  };
  const switchColor = (color: string) => {
    setCurrentColor(color);
    updateElement({
      id: selectedEl.id,
      fill: color,
    });
  };

  return (
    <Fragment>
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          flex="1 0 0"
          overflow="auto"
          paddingX={1.875}
          paddingY={1.75}
          sx={{
            "& .MuiCollapse-root.more-filters": {
              height: 0,
            },
          }}
        >
          <Box
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            marginBottom={2.5}
          >
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: "#24272CB3",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
              }}
            >
              {"Colors in this design"}
            </Typography>
            <IconButton
              onClick={() => {
                setCurrentColor("");
                setEditTool("");
                toggleEditSelected(false);
              }}
            >
              <Close />
            </IconButton>
          </Box>
          <Box gap={1.225} marginBottom={3.5} display="flex" flexWrap="wrap">
            <Tooltip
              title={
                <Fragment>
                  <Typography
                    color="inherit"
                    sx={{
                      fontSize: 10,
                      lineHeight: 1,
                      textAlign: "center",
                    }}
                  >
                    {"Change"}
                  </Typography>
                  <Typography
                    color="inherit"
                    sx={{ fontSize: 10, lineHeight: 1, textAlign: "center" }}
                  >
                    {"Selected Color"}
                  </Typography>
                </Fragment>
              }
            >
              <Box
                id="change-color"
                border="1px solid #99999980"
                borderRadius={0.125}
                component={Button}
                paddingY={0}
                paddingX={0}
                justifyContent="center"
                minWidth="initial"
                height={36}
                width={36}
                onClick={openAddColor}
                sx={{
                  backgroundImage:
                    "linear-gradient(135deg, #FF0000 0%, #FAFF00 18.34%, #00FF2C 39.15%, #00F0FF 56%, #000AFF 75.82%, #DB00FF 95.14%)",
                  boxShadow: "0 0 1px 4px #eef5f9",

                  "&:hover": {
                    borderWidth: 1,
                  },

                  "& .MuiTypography-root": {
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    display: "flex",
                    height: 30,
                    justifyContent: "center",
                    width: 30,
                  },
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    color: "#24272CB3",
                    fontSize: "30px",
                    fontWeight: 300,
                    lineHeight: 1,
                  }}
                >
                  <Cached />
                </Typography>
              </Box>
            </Tooltip>
            <Box
              border="1px solid #99999980"
              borderRadius={0.125}
              columnGap={"5px"}
              component={Button}
              paddingY={0}
              paddingX={0}
              minWidth="initial"
              justifyContent="center"
              height={36}
              width={36}
              onClick={() => switchColor("transparent")}
              sx={{
                boxShadow: "0 0 1px 4px #eef5f9",

                "&:hover": {
                  borderWidth: 1,
                },

                "&:focus": {
                  backgroundColor: "transparent",
                  boxShadow: "0 0 1px 2px #eef5f9, 0 0 1px 4px #12b0ee",
                },
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="//www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="1" fill="#C8C8C8" />
                <rect
                  x="0.5"
                  y="0.5"
                  width="35"
                  height="35"
                  rx="0.5"
                  stroke="#999999"
                  strokeOpacity="0.5"
                />
                <path
                  d="M2 34L34 2"
                  stroke="#FF0000"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
            {designColors &&
              designColors.map((color: string, index: number) => (
                <Box
                  border="1px solid #99999980"
                  borderRadius={0.125}
                  columnGap={"5px"}
                  component={Button}
                  paddingY={0}
                  paddingX={0}
                  minWidth="initial"
                  justifyContent="center"
                  key={index}
                  height={36}
                  width={36}
                  onClick={() => switchColor(color)}
                  sx={{
                    boxShadow: "0 0 1px 4px #eef5f9",

                    "&:hover": {
                      borderWidth: 1,
                    },

                    "&.Mui-selected, &:focus": {
                      backgroundColor: "transparent",
                      boxShadow: "0 0 1px 2px #eef5f9, 0 0 1px 4px #12b0ee",
                    },
                  }}
                >
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="//www.w3.org/2000/svg"
                  >
                    <rect width="36" height="36" fill={color} />
                  </svg>
                </Box>
              ))}
          </Box>
          <Box marginBottom={2.5}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: "#24272CB3",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
              }}
            >
              {"Brand Colors"}
            </Typography>
          </Box>
          <Box gap={1.225} marginBottom={3.5} display="flex" flexWrap="wrap">
            {[
              "#000000",
              "#545454",
              "#737373",
              "#A6A6A6",
              "#D9D9D9",
              "#FFFFFF",
            ].map((color, index) => (
              <Box
                border="1px solid #99999980"
                borderRadius={0.125}
                columnGap={"5px"}
              // @ts-expect-error MUI v7 component prop typing issue
                component={ToggleButton}
                paddingY={0}
                paddingX={0}
                minWidth="initial"
                justifyContent="center"
                key={index}
                color={color}
                onClick={() => switchColor(color)}
                height={36}
                width={36}
                sx={{
                  boxShadow: "0 0 1px 4px #eef5f9",

                  "&:hover": {
                    borderWidth: 1,
                  },

                  "&.Mui-selected, &:focus": {
                    backgroundColor: "transparent",
                    boxShadow: "0 0 1px 2px #eef5f9, 0 0 1px 4px #12b0ee",
                  },
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="//www.w3.org/2000/svg"
                >
                  <rect width="36" height="36" fill={color} />
                </svg>
              </Box>
            ))}
          </Box>
          <Box marginBottom={2.5}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                color: "#24272CB3",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: "19px",
              }}
            >
              {"Color Swatch"}
            </Typography>
          </Box>
          <Box gap={1.225} marginBottom={3.5} display="flex" flexWrap="wrap">
            {swatchColor.map((color, index) => (
              <Box
                border="1px solid #99999980"
                borderRadius={0.125}
              // @ts-expect-error MUI v7 component prop typing issue
                columnGap={"5px"}
                component={ToggleButton}
                paddingY={0}
                paddingX={0}
                minWidth="initial"
                justifyContent="center"
                key={index}
                color={color}
                onClick={() => switchColor(color)}
                height={36}
                width={36}
                sx={{
                  boxShadow: "0 0 1px 4px #eef5f9",

                  "&:hover": {
                    borderWidth: 1,
                  },

                  "&.Mui-selected, &:focus": {
                    backgroundColor: "transparent",
                    boxShadow: "0 0 1px 2px #eef5f9, 0 0 1px 4px #12b0ee",
                  },
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="//www.w3.org/2000/svg"
                >
                  <rect width="36" height="36" fill={color} />
                </svg>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Popover
        anchorEl={addColorEl}
        open={Boolean(addColorEl)}
        onClose={() => {
          updateElement({
            id: selectedEl.id,
            fill: currentColor,
          });
          closeAddColor();
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
          "& .MuiPopover-paper": {
            mt: 1,
            borderRadius: 0.25,
          },
        }}
      >
        <ChromePicker
          color={currentColor}
          disableAlpha={true}
          onChange={(color: ColorResult) => {
            const newColor = color.hex;
            setCurrentColor(newColor);
            updateElement(
              {
                id: selectedEl.id,
                fill: newColor,
              },
              { saveHistory: false }
            );
          }}
        />
      </Popover>
    </Fragment>
  );
};

export default ShapeColor;
