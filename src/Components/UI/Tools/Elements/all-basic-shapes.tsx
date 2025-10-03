import { Fragment } from "react";
import { Box, Button, Typography } from "@mui/material";
import Konva from "konva";
import svgPath from "svgpath";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import {
  circle,
  chat,
  triangle,
  square,
  star,
  RenderSolidShape,
} from "Assets/Shapes";

const AllBasicShapes = () => {
  const { canvas, setMultiSelectIds } = useAppState();
  const { addElement, setSelected } = useElementsContext();
  const addShape = (shape: string, data: any = undefined) => {
    const [element] = addElement<Konva.ShapeConfig>({
      type: shape,
      ...(shape === "path"
        ? {
            d: svgPath(data.d).scale(2).toString(),
            height: data.height * 2,
            width: data.width * 2,
            x: canvas.height / 2,
            y: canvas.width / 2,
            shapeName: data.shapeName,
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

  return (
    <Fragment>
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
      </Box>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={3.5}
        justifyContent="space-evenly"
        marginBottom={1.25}
      >
        {[square, circle, triangle, star, chat].map((shapeData, index) => (
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
    </Fragment>
  );
};

export default AllBasicShapes;
