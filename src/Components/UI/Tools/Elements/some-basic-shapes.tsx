import { Fragment } from "react";
import { Box, Button, Link, Typography } from "@mui/material";
import Konva from "konva";
import svgPath from "svgpath";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import {
  circle,
  triangle,
  square,
  star,
  RenderSolidShape,
} from "Assets/Shapes";

const SomeBasicShapes = ({ toggleView }: any) => {
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
        <Link
          component="button"
          underline="hover"
          onClick={() => toggleView("basic-shapes")}
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
            {`See All`}
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
    </Fragment>
  );
};

export default SomeBasicShapes;
