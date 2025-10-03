import { Fragment, MouseEvent, useRef, useState } from "react";
import {
  Box,
  ButtonGroup,
  Button,
  Chip,
  Grid,
  IconButton,
  Input,
  Typography,
  Paper,
  Popover,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";
import { ArrowDropDown, Logout, Login } from "@mui/icons-material";

import { ArrowRight, Back, Undo, Redo } from "Assets/Icons";
import { useAppState } from "Contexts/AppState";
import { useHistory } from "Contexts/History";
import { useElementsContext } from "Contexts/Elements";
import WebFontLoader from "webfontloader";

const style = makeStyles((theme: Theme) => ({
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #97979733",

    "& .container": {
      display: "flex",
      justifyContent: "space-between",
      height: "60px",

      "& .logo": {
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flexShrink: 1,
        height: "100%",
        padding: "0 30px",
        width: "80px",
      },

      "& .back": {
        alignItems: "center",
        columnGap: "10px",
        display: "flex",
        justifyContent: "center",
        flexShrink: 1,
        height: "100%",

        "& .MuiTypography-root": {
          color: "#24272CB3",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "16px",
        },
      },

      "& .prompt-actions": {
        alignItems: "center",
        columnGap: "10px",
        display: "flex",
        height: "100%",
        margin: "0 auto",

        "& .MuiIconButton-root": {
          "&.Mui-disabled": {
            "& svg": {
              opacity: 0.5,
            },
          },
        },
      },

      "& .save-actions": {
        alignItems: "center",
        columnGap: "10px",
        display: "flex",
        height: "100%",
        paddingRight: "30px",

        "& .MuiTypography-root": {
          color: "#24272C80",
          fontWeight: 400,
          fontSize: "12px",
          lineHeight: "14px",
        },
      },
    },
  },
}));

const Header = () => {
  const isMac =
    typeof window !== "undefined" ? navigator.userAgent.includes("Mac") : false;
  const classes = style();
  const {
    canvas,
    setCurrentColor,
    toggleEditSelected,
    setEditTool,
    setMultiSelectIds,
    safeFonts,
  } = useAppState();
  const { redo, undo, canRedo, canUndo } = useHistory();
  const { layer, elements, setElements, setFocused, setSelected } =
    useElementsContext();

  const [moreActionsEl, setMoreActionsEl] = useState<HTMLButtonElement | null>(
    null
  );
  const anchorRef = useRef<HTMLDivElement>(null);
  const openMoreActions = (event: MouseEvent<HTMLButtonElement>) => {
    setMoreActionsEl(event.currentTarget);
  };
  const closePosition = () => {
    setMoreActionsEl(null);
  };
  const doImport = ({
    target: {
      files: [file],
    },
  }: any) => {
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onabort = () => console.info("file reading was aborted");
    reader.onerror = () => console.error("file reading has failed");
    reader.onload = () => {
      setMultiSelectIds(new Set());
      const data = JSON.parse(String(reader.result));
      const fontsToLoad: string[] = data
        .filter((e: any) => e.type === "text")
        .map((e: any) => e.fontFamily)
        .filter((font: string) => !safeFonts.includes(font));
      const families = Array.from(new Set(fontsToLoad));
      if (families.length === 0) {
        setElements(data);
        return;
      }
      let fontsActive = 0;
      WebFontLoader.load({
        google: { families },
        fontactive: () => {
          fontsActive++;
          if (fontsActive === families.length) setElements(data);
        },
      });
    };
    /*
      const result = JSON.parse(JSON.parse(String(reader.result)));
      const formatted = result.children.map((shape: any) => shape.attrs);
      addElement(formatted);
    */
    reader.readAsText(file);
  };
  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadImage = () => {
    const base64 = layer.toDataURL({
      pixelRatio: 2,
      width: canvas.width,
      height: canvas.height,
      mimeType: "image/png",
      quality: 1,
    });
    downloadURI(base64, "image.png");
  };
  const save_n_schedule = () => {
    setSelected(null);
    setFocused(null);
    setCurrentColor("");
    setEditTool("");
    toggleEditSelected(false);
    setTimeout(() => downloadImage(), 1000);
  };
  const doExport = () => {
    const blob = new Blob([JSON.stringify(elements)], {
      type: "application/json",
    });
    downloadURI(URL.createObjectURL(blob), "image.json");
    /*
    const serialized = layer.toJSON();
    const blob = new Blob([JSON.stringify(serialized)], {
      type: "application/json",
    });
    downloadURI(URL.createObjectURL(blob), "image.json");
    */
  };

  return (
    <Fragment>
      <Box component="header" className={classes.header}>
        <Box className="container">
          <Box className="logo">
            <img
              src="/images/svg/logo.svg"
              alt="Logo"
              width={26}
              height={30}
              loading="lazy"
            />
          </Box>
          <Box position="relative">
            <Box position="absolute" className="back">
              <IconButton>
                <Back />
              </IconButton>
              <Typography component="p" whiteSpace="nowrap">
                {"Back to Design"}
              </Typography>
            </Box>
          </Box>
          <Box className="prompt-actions">
            {[
              {
                toolTipTitle: `[${isMac ? `⌘` : `Ctrl`} + Z]`,
                icon: <Undo />,
                label: "Undo",
                disabled: !canUndo,
                doClick: () => undo(),
              },
              {
                toolTipTitle: `[${isMac ? `⌘ + Shift + Z` : `Ctrl + Y`}]`,
                icon: <Redo />,
                label: "Redo",
                disabled: !canRedo,
                doClick: () => redo(),
              },
            ].map(({ toolTipTitle, icon, label, disabled, doClick }, index) =>
              disabled ? (
                <Chip
                  disabled={disabled}
                  component="button"
                  key={index}
                  icon={icon}
                  label={label}
                  sx={{
                    backgroundColor: "transparent",
                    px: 1.5,
                    py: 0,
                    gap: 1.5,

                    "& .MuiChip-label": {
                      color: "#24272CB3",
                      fontSize: 14,
                      lineHeight: 1.75,
                      fontWeight: 400,
                      p: 0,
                    },
                  }}
                />
              ) : (
                <Tooltip title={toolTipTitle} key={index}>
                  <Chip
                    disabled={disabled}
                    component="button"
                    key={index}
                    icon={icon}
                    label={label}
                    onClick={doClick}
                    sx={{
                      backgroundColor: "transparent",
                      gap: 1.5,
                      px: 1.5,
                      py: 0,

                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },

                      "& .MuiChip-label": {
                        color: "#24272CB3",
                        fontSize: 14,
                        lineHeight: 1.75,
                        fontWeight: 400,
                        p: 0,
                      },
                    }}
                  />
                </Tooltip>
              )
            )}
          </Box>
          <Box position="relative">
            <Box position="absolute" right={0} height="100%">
              <Box className="save-actions">
                <Typography component="p" whiteSpace="nowrap">
                  {"autosaved at 3.58PM"}
                </Typography>
                <ButtonGroup
                  variant="contained"
                  color="primary"
                  ref={anchorRef}
                  aria-label="design action"
                >
                  <Button
                    size="small"
                    aria-controls={
                      Boolean(moreActionsEl) ? "more-actions" : undefined
                    }
                    aria-expanded={Boolean(moreActionsEl) ? "true" : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={openMoreActions}
                    sx={{ pr: 0.5 }}
                  >
                    <ArrowDropDown />
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowRight />}
                    onClick={save_n_schedule}
                    sx={{ pl: 0.5, whiteSpace: "nowrap" }}
                  >
                    {"Save & Schedule"}
                  </Button>
                </ButtonGroup>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Popover
        id={Boolean(moreActionsEl) ? "more-actions" : undefined}
        anchorEl={moreActionsEl}
        open={Boolean(moreActionsEl)}
        onClose={closePosition}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          "& .MuiPopover-paper": {
            mt: 1.5,
            borderRadius: 0.25,
            width: 320,
          },
        }}
      >
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                component="label"
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: 0,
                  flexDirection: "column",
                }}
              >
                <Input
                  onChange={doImport}
                  inputProps={{
                    accept: "application/json",
                    type: "file",
                  }}
                  sx={{ display: "none" }}
                />
                <Login />
                <Typography variant="body1" component="span">
                  {"Import Design"}
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: 0,
                  flexDirection: "column",
                }}
                onClick={doExport}
              >
                <Logout />
                <Typography variant="body1" component="span">
                  {"Export Design"}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Popover>
    </Fragment>
  );
};

export default Header;
