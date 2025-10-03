import { Box } from "@mui/material";

import { useAppState } from "Contexts/AppState";

import Layout from "Layout";
import Stage from "Components/Stage";

const Home = () => {
  const { containerRef } = useAppState();
  return (
    <>
      <title>EasySocial Design Tool</title>
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

export default Home;
