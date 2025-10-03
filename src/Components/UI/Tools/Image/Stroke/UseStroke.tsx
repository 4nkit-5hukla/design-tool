import { useEffect, useState } from "react";

import { Box, Switch, Typography } from "@mui/material";

import { useElementsContext } from "Contexts/Elements";

export const UseStroke = ({ selectedEl, updateElement }: any) => {
  const { unSelect, setSelected } = useElementsContext();
  const [strokeEnabled, setStrokeEnabled] = useState<boolean>(false);

  useEffect(() => {
    selectedEl && setStrokeEnabled(selectedEl.strokeEnabled);
  }, [selectedEl]);

  return (
    <Box display="flex" flexDirection="column" rowGap={1} marginBottom={3.5}>
      <Box alignItems="center" display="flex" justifyContent="space-between">
        <Typography
          component="label"
          variant="caption"
          display="block"
          htmlFor="strokeEnabled"
          sx={{
            color: "#24272CB3",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "16px",
          }}
        >
          {"Enable Stroke"}
        </Typography>
        <Switch
          checked={strokeEnabled}
          onChange={({ target: { checked } }) => {
            setStrokeEnabled(checked);
            const { id } = selectedEl;
            updateElement({
              id,
              strokeEnabled: checked,
            });
            unSelect();
            setTimeout(() => setSelected(id), 0);
          }}
          inputProps={{
            id: "strokeEnabled",
            "aria-label": "controlled",
          }}
        />
      </Box>
    </Box>
  );
};
