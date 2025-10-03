import { Fragment, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { useElementsContext } from "Contexts/Elements";
import { StrokeColor, StrokeWidth, UseStroke } from "./Stroke";

const ImageStroke = () => {
  const { selectedEl, updateElement } = useElementsContext();
  const [strokeEnabled, setStrokeEnabled] = useState<boolean>(false);

  useEffect(() => {
    selectedEl && setStrokeEnabled(selectedEl.strokeEnabled);
  }, [selectedEl]);

  return (
    <Fragment>
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
          {"Stroke"}
        </Typography>
      </Box>
      <Box>
        <UseStroke {...{ selectedEl, updateElement }} />
        <StrokeWidth {...{ strokeEnabled, selectedEl, updateElement }} />
        <StrokeColor {...{ strokeEnabled, selectedEl, updateElement }} />
      </Box>
    </Fragment>
  );
};

export default ImageStroke;
