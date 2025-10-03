import { Fragment } from "react";
import { Box, Button, Link, Typography } from "@mui/material";
import Konva from "konva";

import {
  shape1data,
  shape2data,
  shape3data,
  shape4data,
  shape5data,
} from "Assets/ComplexShapes/data";
import { RenderShape } from "Assets/ComplexShapes";
import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

const SomeSVGShapes = ({ toggleView }: any) => {
  const { canvas, setMultiSelectIds } = useAppState();
  const { addElement, setSelected } = useElementsContext();
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
    <Fragment>
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
          onClick={() => toggleView("svg-shapes")}
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
        gap={3.5}
        justifyContent="space-evenly"
        marginBottom={1.25}
        flexWrap="wrap"
      >
        {[shape1data, shape2data, shape3data, shape4data, shape5data].map(
          (shapeData, index) => (
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
          )
        )}
      </Box>
    </Fragment>
  );
};

export default SomeSVGShapes;
