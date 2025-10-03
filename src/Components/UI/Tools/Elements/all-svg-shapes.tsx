import { Fragment } from "react";
import { Box, Button, Typography } from "@mui/material";
import Konva from "konva";

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
import { RenderShape } from "Assets/ComplexShapes";
import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

const AllSVGShapes = () => {
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
    </Fragment>
  );
};

export default AllSVGShapes;
