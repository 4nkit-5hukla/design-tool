import { FC, Fragment, MouseEvent, useEffect, useState } from "react";

import { Box, Button, Popover, Typography } from "@mui/material";
import { ChromePicker, ColorResult } from "react-color";
import { ShadowProps } from "Interfaces/ComponentProps";

export const Color: FC<ShadowProps> = ({ shadowEnabled, selectedEl, updateElement }) => {
  const [shadowColor, setShadowColor] = useState<string>("#000000");
  const [changeColorEl, setChangeColorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const openChangeColor = (event: MouseEvent<HTMLButtonElement>) => {
    setChangeColorEl(event.currentTarget);
  };
  const closeChangeColor = () => {
    setChangeColorEl(null);
  };

  useEffect(() => {
    selectedEl && setShadowColor(selectedEl.shadowColor);
  }, [selectedEl]);

  return (
    <Fragment>
      <Box display="flex" flexDirection="column" rowGap={1} marginBottom={3.5}>
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
            {"Shadow Color"}
          </Typography>
          <Box
            border="none"
            borderRadius={0.625}
            columnGap={"5px"}
            component={Button}
            paddingY={0}
            paddingX={0}
            justifyContent="center"
            minWidth="unset"
            disabled={!shadowEnabled}
            onClick={openChangeColor}
            sx={{
              "&:focus": {
                boxShadow: "0 0 1px 2px #eef5f9, 0 0 1px 4px #12b0ee",
              },
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="//www.w3.org/2000/svg"
            >
              <rect
                width="24"
                height="24"
                rx="5"
                fill={shadowColor}
                stroke="#99999980"
                strokeWidth={1}
              />
            </svg>
          </Box>
        </Box>
      </Box>
      <Popover
        anchorEl={changeColorEl}
        open={Boolean(changeColorEl)}
        onClose={() => {
          updateElement({
            id: selectedEl.id,
            shadowColor,
          });
          closeChangeColor();
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPopover-paper": {
            mt: 1,
            borderRadius: 0.25,
          },
        }}
      >
        <ChromePicker
          color={shadowColor}
          disableAlpha={true}
          onChange={(color: ColorResult) => {
            setShadowColor(color.hex);
            updateElement(
              {
                id: selectedEl.id,
                shadowColor: color.hex,
              },
              { saveHistory: false }
            );
          }}
        />
      </Popover>
    </Fragment>
  );
};
