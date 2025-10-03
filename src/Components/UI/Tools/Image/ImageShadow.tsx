import { Fragment, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { useElementsContext } from "Contexts/Elements";
import { Blur, Color, OffsetH, OffsetV, Opacity, UseShadow } from "./Shadow";

const ImageShadow = () => {
  const { selectedEl, updateElement } = useElementsContext();
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(false);

  useEffect(() => {
    selectedEl && setShadowEnabled(selectedEl.shadowEnabled);
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
          {"Shadow"}
        </Typography>
      </Box>
      <Box>
        <UseShadow {...{ selectedEl, updateElement }} />
        <OffsetH {...{ shadowEnabled, selectedEl, updateElement }} />
        <OffsetV {...{ shadowEnabled, selectedEl, updateElement }} />
        <Blur {...{ shadowEnabled, selectedEl, updateElement }} />
        <Opacity {...{ shadowEnabled, selectedEl, updateElement }} />
        <Color {...{ shadowEnabled, selectedEl, updateElement }} />
      </Box>
    </Fragment>
  );
};

export default ImageShadow;
