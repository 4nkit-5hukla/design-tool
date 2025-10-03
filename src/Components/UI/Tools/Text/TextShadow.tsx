import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { useElementsContext } from "Contexts/Elements";
import { Blur, Color, OffsetH, OffsetV, Opacity, UseShadow } from "./Shadow";
import { StrokeColor, StrokeWidth, UseStroke } from "./Stroke";

const TextShadow = () => {
  const { selectedEl, updateElement } = useElementsContext();
  const [strokeEnabled, setStrokeEnabled] = useState<boolean>(false);
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(false);

  useEffect(() => {
    selectedEl && setStrokeEnabled(selectedEl.strokeEnabled);
    selectedEl && setShadowEnabled(selectedEl.shadowEnabled);
  }, [selectedEl]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box paddingX={2.5} paddingY={1.75} marginBottom={2.5}>
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
          {"Text Effect"}
        </Typography>
      </Box>
      <Box
        flex="1 0 0"
        overflow="auto"
        paddingX={2.5}
        paddingY={1.75}
        sx={{
          "& .MuiCollapse-root.more-filters": {
            height: 0,
          },
        }}
      >
        <UseStroke {...{ selectedEl, updateElement }} />
        <StrokeWidth {...{ strokeEnabled, selectedEl, updateElement }} />
        <StrokeColor {...{ strokeEnabled, selectedEl, updateElement }} />
        <UseShadow {...{ selectedEl, updateElement }} />
        <OffsetH {...{ shadowEnabled, selectedEl, updateElement }} />
        <OffsetV {...{ shadowEnabled, selectedEl, updateElement }} />
        <Blur {...{ shadowEnabled, selectedEl, updateElement }} />
        <Opacity {...{ shadowEnabled, selectedEl, updateElement }} />
        <Color {...{ shadowEnabled, selectedEl, updateElement }} />
      </Box>
    </Box>
  );
};

export default TextShadow;
