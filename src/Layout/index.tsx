import { Fragment, ReactNode } from "react";
import { Box } from "@mui/material";

import { useAppState } from "Contexts/AppState";
import Header from "Components/Header";
import Sidebar from "Components/Sidebar";
import ToolBarTop from "Components/UI/ToolBar/Top";
import ToolBarBottom from "Components/UI/ToolBar/Bottom";

const Layout = ({ children }: { children: ReactNode }) => {
  const { rootRef } = useAppState();

  return (
    <Fragment>
      <Box
        {...{
          ref: rootRef,
          component: "section",
          display: "flex",
          width: "100%",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Header />
        <Box
          {...{
            display: "flex",
            height: "100%",
          }}
        >
          <Sidebar />
          <Box
            bgcolor="#AEC1CB"
            component="main"
            display="flex"
            flexDirection="column"
            flexGrow={1}
            position="relative"
            overflow="hidden"
          >
            <Box height="100%" position="relative" width="100%">
              <Box
                bottom={0}
                display="flex"
                flexDirection="column"
                left={0}
                position="absolute"
                right={0}
                top={0}
                zIndex={0}
              >
                <ToolBarTop />
                {children}
                <ToolBarBottom />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
};

export default Layout;
