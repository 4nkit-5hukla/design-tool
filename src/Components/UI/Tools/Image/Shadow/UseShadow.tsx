import { FC, useEffect, useState } from "react";

import { Box, Switch, Typography } from "@mui/material";
import { ToolbarProps } from "Interfaces/ComponentProps";

export const UseShadow: FC<ToolbarProps> = ({ selectedEl, updateElement }) => {
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(false);

  useEffect(() => {
    selectedEl && setShadowEnabled(selectedEl.shadowEnabled);
  }, [selectedEl]);

  return (
    <Box display="flex" flexDirection="column" rowGap={1} marginBottom={3.5}>
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Typography
          component="label"
          variant="caption"
          display="block"
          htmlFor="shadowEnabled"
          sx={{
            color: "#24272CB3",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "16px",
          }}
        >
          {"Enable Shadow"}
        </Typography>
        <Switch
          checked={shadowEnabled}
          onChange={({ target: { checked } }) => {
            setShadowEnabled(checked);
            updateElement({ ...selectedEl, shadowEnabled: checked });
          }}
          inputProps={{
            id: "shadowEnabled",
            "aria-label": "controlled",
          }}
        />
      </Box>
    </Box>
  );
};
