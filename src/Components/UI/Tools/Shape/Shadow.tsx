import { FC, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { useElementsContext } from "Contexts/Elements";
import { Blur } from "./Shadow/Blur";
import { Color } from "./Shadow/Color";
import { OffsetH } from "./Shadow/OffsetH";
import { OffsetV } from "./Shadow/OffsetV";
import { Opacity } from "./Shadow/Opacity";
import { UseShadow } from "./Shadow/UseShadow";

const ShapeShadow: FC = () => {
  const { selectedEl, updateElement } = useElementsContext();
  const [shadowEnabled, setShadowEnabled] = useState<boolean>(false);

  useEffect(() => {
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
          {"Shadow"}
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

export default ShapeShadow;
