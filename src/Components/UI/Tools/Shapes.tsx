import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  FormControl,
  FilledInput,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import Konva from "konva";
import svgpath from "svgpath";

import {
  circle,
  chat,
  triangle,
  square,
  star,
  RenderSolidShape,
} from "Assets/Shapes";
import { Rectangle, Ellipse, Triangle, Star, Chat } from "Assets/Icons";
import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { RenderShape } from "Assets/ComplexShapes";
import {
  shape1data,
  shape2data,
  shape3data,
  shape4data,
  shape5data,
  shape6data,
  shape7data,
  shape8data,
  shape9data,
  shape10data,
} from "Assets/ComplexShapes/data";

const Shapes = () => {
  const { canvas, setMultiSelectIds } = useAppState();
  const { addElement, setSelected } = useElementsContext();
  const [showMoreShapes, toggleMoreShapes] = useState<boolean>(false);
  const [showMoreTags, toggleMoreTags] = useState<boolean>(false);
  const addShape = (shape: string, data: any = undefined) => {
    const [element] = addElement<Konva.ShapeConfig>({
      type: shape,
      ...(shape === "path"
        ? {
            d: svgpath(data.d).scale(2).toString(),
            height: data.height * 2,
            width: data.width * 2,
            x: canvas.height / 2,
            y: canvas.width / 2,
          }
        : {}),
      ...(data.shapeName === "circle" || data.shapeName === "square"
        ? {
            useAnchors: [
              "top-left",
              "top-center",
              "top-right",
              "middle-right",
              "bottom-right",
              "bottom-center",
              "bottom-left",
              "middle-left",
            ],
          }
        : {
            useAnchors: [
              "top-left",
              "top-right",
              "bottom-right",
              "bottom-left",
            ],
          }),
    });
    setSelected(element.id);
    setMultiSelectIds(new Set());
  };
  const addFlatSVG = (data: any = undefined) => {
    const [element] = addElement<Konva.ShapeConfig>({
      type: "flat-svg",
      ...data,
      height: data.height * 2,
      width: data.width * 2,
      x: canvas.height / 2,
      y: canvas.width / 2,
    });
    setSelected(element.id);
    setMultiSelectIds(new Set());
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box paddingX={1} paddingTop={1.5}>
        <FormControl
          className="search-box"
          variant="filled"
          sx={{ width: "100%", height: "42px", mb: 1 }}
        >
          <FilledInput
            placeholder="Search for a Shape"
            startAdornment={
              <InputAdornment
                position="start"
                sx={{
                  color: "#24272C80",
                  mt: "0!important",
                }}
              >
                <Search />
              </InputAdornment>
            }
            inputProps={{
              sx: { py: 0 },
            }}
            disableUnderline={true}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              color: "#24272C80",
              height: "100%",

              "&:hover,&.Mui-focused": {
                backgroundColor: "#ffffff",
              },
            }}
          />
        </FormControl>
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
        <Box
          alignItems="baseline"
          display="flex"
          justifyContent="space-between"
          marginBottom={2.5}
        >
          <Typography
            component="p"
            sx={{
              color: "#24272CB3",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "16px",
            }}
          >
            {"Basic Shapes"}
          </Typography>
          <Link
            component="button"
            underline="hover"
            onClick={() => toggleMoreShapes(!showMoreShapes)}
            sx={{
              color: "#24272CB3",

              underline: {
                "&:before": {
                  borderColor: "#24272CB3",
                },

                "&:after": {
                  borderColor: `#24272CB3`,
                },

                "&:hover:not($disabled):not($focused):not($error):before": {
                  borderColor: `#24272CB3`,
                },
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "#24272CB3",
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: "14px",
              }}
            >
              {`show ${showMoreShapes ? ` less -` : ` more +`}`}
            </Typography>
          </Link>
        </Box>
        <Box
          display="flex"
          columnGap={3.5}
          justifyContent="space-evenly"
          marginBottom={1.25}
        >
          {[square, circle, triangle, star].map((shapeData, index) => (
            <Box
              key={index}
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", shapeData)}
            >
              <RenderSolidShape {...shapeData} />
            </Box>
          ))}
        </Box>
        <Box component={Collapse} in={showMoreShapes} className="more-filters">
          <Box
            display="flex"
            columnGap={3.5}
            justifyContent="space-evenly"
            rowGap={1.25}
            flexWrap="wrap"
          >
            <Box
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", chat)}
            >
              <Chat />
            </Box>
            <Box
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", circle)}
            >
              <Ellipse />
            </Box>
            <Box
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", triangle)}
            >
              <Triangle />
            </Box>
            <Box
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", star)}
            >
              <Star />
            </Box>
            <Box
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", square)}
            >
              <Rectangle />
            </Box>
            <Box
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", circle)}
            >
              <Ellipse />
            </Box>
            <Box
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", triangle)}
            >
              <Triangle />
            </Box>
            <Box
              component={Button}
              padding={0}
              minWidth="unset"
              disableRipple
              borderRadius={0}
              onClick={() => addShape("path", star)}
            >
              <Star />
            </Box>
          </Box>
        </Box>
        <Box
          alignItems="baseline"
          display="flex"
          justifyContent="space-between"
          marginTop={5}
          marginBottom={2.5}
        >
          <Typography
            component="p"
            sx={{
              color: "#24272CB3",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "16px",
            }}
          >
            {"Sale & Offer Tag"}
          </Typography>
          <Link
            component="button"
            underline="hover"
            onClick={() => toggleMoreTags(!showMoreTags)}
            sx={{
              color: "#24272CB3",

              underline: {
                "&:before": {
                  borderColor: "#24272CB3",
                },

                "&:after": {
                  borderColor: `#24272CB3`,
                },

                "&:hover:not($disabled):not($focused):not($error):before": {
                  borderColor: `#24272CB3`,
                },
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "#24272CB3",
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: "14px",
              }}
            >
              {`show ${showMoreTags ? ` less -` : ` more +`}`}
            </Typography>
          </Link>
        </Box>
        <Box
          display="flex"
          gap={3.5}
          justifyContent="space-evenly"
          marginBottom={1.25}
          flexWrap="wrap"
        >
          {[
            shape1data,
            shape2data,
            shape3data,
            shape4data,
            shape5data,
            shape6data,
            shape7data,
            shape8data,
            shape9data,
            shape10data,
          ].map((shapeData, index) => (
            <Box
              key={index}
              component={Button}
              padding={0}
              minWidth="unset"
              // disableRipple
              borderRadius={0}
              onClick={() => addFlatSVG(shapeData)}
            >
              <RenderShape {...shapeData} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Shapes;
