import { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

import {
  Assets as AssetsIcon,
  Text as TextIcon,
  Shapes as ElementsIcon,
  Templates as TemplatesIcon,
} from "Assets/Icons";

import Templates from "Components/UI/Tools/Templates";
import Text from "Components/UI/Tools/Text";
import MyAssets from "Components/UI/Tools/MyAssets";
import EditImage from "Components/UI/Tools/EditImage";
import EditText from "Components/UI/Tools/EditText";
import EditFlatSVG from "Components/UI/Tools/EditFlatSVG";
import EditShape from "Components/UI/Tools/EditShape";
import Elements from "./UI/Tools/Elements";

const style = makeStyles((theme: Theme) => ({
  sidebar: {
    backgroundColor: "#ffffff",
    boxShadow: "inset -1px 0 0 #97979733",
    display: "flex",

    "& .container": {
      paddingLeft: "4px",
      height: "100%",

      "& .MuiList-root": {
        "& .MuiListItemButton-root": {
          "& .MuiListItemIcon-root": {
            minWidth: "unset",
          },

          "& .MuiListItemText-root": {
            "& .MuiListItemText-primary": {
              color: "#8E9197B3",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "14px",
            },
          },

          "&.Mui-selected, &:hover": {
            background: "linear-gradient(90deg, #E1F5FF 0%, #EEF5F9 95.45%)",
            borderRadius: "9px 0 0 9px",
          },

          "&.Mui-selected": {
            "& .MuiListItemIcon-root": {
              minWidth: "unset",

              "& svg": {
                "& path": {
                  fill: "#12B0EE",
                },
              },
            },

            "& .MuiListItemText-root": {
              "& .MuiListItemText-primary": {
                color: "#12B0EE",
              },
            },
          },
        },
      },
    },

    "& .MuiCollapse-root": {
      height: "100%",

      "& .collapse-wrapper": {
        backgroundColor: "#EEF5F9",
        width: "295px",
        height: "100%",
      },
    },
  },
}));

const Sidebar = () => {
  const classes = style();
  const {
    editSelected,
    editTool,
    setCurrentColor,
    setEditTool,
    toggleEditSelected,
  } = useAppState();
  const { selectedEl, setSelected, setFocused, unFocus } = useElementsContext();
  const [current, setCurrent] = useState(-1);
  const [
    show,
    // toggleShow
  ] = useState(true);
  const MenuOptions = [
    { label: "Templates", icon: <TemplatesIcon />, tool: "Templates" },
    { label: "Elements", icon: <ElementsIcon />, tool: "Elements" },
    { label: "Text", icon: <TextIcon />, tool: "Text" },
    { label: "My Assets", icon: <AssetsIcon />, tool: "MyAssets" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setCurrent(1);
      // toggleShow(true);
    }, 200);
  }, []);

  // useEffect(() => {
  //   editSelected && toggleShow(editSelected);
  // }, [editSelected]);

  return (
    <aside className={classes.sidebar}>
      <Box className="container" height="100%" width="80px">
        <List
          component="div"
          sx={{ width: "100%", maxWidth: 80, py: 3 }}
          aria-label="contacts"
        >
          {MenuOptions.map(({ label, icon }, index) => (
            <ListItemButton
              component={"button"}
              onClick={() => {
                setSelected(null);
                setFocused(null);
                setCurrentColor("");
                setEditTool("");
                toggleEditSelected(false);
                unFocus();
                if (show) {
                  if (current === index) {
                    setCurrent(-1);
                    // toggleShow(false);
                  } else {
                    // toggleShow(false);
                    setTimeout(() => {
                      setCurrent(index);
                      // toggleShow(true);
                    }, 400);
                  }
                } else {
                  setCurrent(index);
                  // toggleShow(true);
                }
              }}
              sx={{ p: 1, flexDirection: "column", width: "100%" }}
              selected={current === index}
              key={index}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Collapse orientation={"horizontal"} in={show}>
        <Box className="collapse-wrapper">
          {editSelected
            ? (() => {
                switch (selectedEl?.type) {
                  case "image":
                    return <EditImage />;
                  case "text":
                    return <EditText tool={editTool} />;
                  case "flat-svg":
                    return <EditFlatSVG tool={editTool} />;
                  case "path":
                  case "circle":
                  case "ellipse":
                  case "rectangle":
                  case "rect":
                  case "clippedImage":
                    return <EditShape tool={editTool} />;
                  default:
                    return null;
                }
              })()
            : current > -1 &&
              (() => {
                switch (MenuOptions[current].tool) {
                  case "Templates":
                    return <Templates />;
                  case "Elements":
                    return <Elements />;
                  case "Text":
                    return <Text />;
                  case "MyAssets":
                  default:
                    return <MyAssets />;
                }
              })()}
        </Box>
      </Collapse>
    </aside>
  );
};

export default Sidebar;
