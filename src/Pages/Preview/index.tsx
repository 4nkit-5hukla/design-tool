/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Box } from "@mui/material";
import { useSearchParams } from "react-router-dom";

import { useLocalStorage } from "Hooks";
import { useAppState } from "Contexts/AppState";
import Layout from "Layout";
import Stage from "Components/Stage";

const Preview = () => {
  const [searchParams] = useSearchParams();
  const { containerRef } = useAppState();
  const [, setBusinessId] = useLocalStorage("businessId", "");
  const [, setToken] = useLocalStorage("token", "");

  useEffect(() => {
    if (searchParams) {
      const store = searchParams.get("store");
      if (store && JSON.parse(store)) {
        setBusinessId(searchParams.get("businessId"));
        setToken(searchParams.get("token"));
      }
    }
  }, [searchParams]);

  return (
    <>
      <title>EasySocial Design Preview</title>
      <Layout>
        <Box flex={1} minHeight={0} position="relative" sx={{ contain: "content" }} zIndex={0}>
          <Box
            flex={1}
            display="flex"
            height="100%"
            overflow="auto"
            position="relative"
            ref={containerRef}
            sx={{
              WebkitTapHighlightColor: "transparent",
              contain: "content",
              touchAction: "pan-x pan-y pinch-zoom",
              userSelect: "none",
            }}
          >
            <Stage />
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default Preview;
