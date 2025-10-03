/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment } from "react";
import { Box, Typography, Link, Card, CardMedia, Button } from "@mui/material";
import { Masonry } from "@mui/lab";
import Konva from "konva";
import { parse } from "svgson";
import svgPath from "svgpath";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { I_Elements } from "Interfaces";

const Featured = ({
  index,
  category_id,
  category_name,
  elements,
  gird_size,
}: {
  index: number;
  category_id: number;
  category_name: string;
  gird_size: number;
  elements: I_Elements[];
}) => {
  const { canvas, toggleViewCategory, setMultiSelectIds } = useAppState();
  const { addElement, setSelected } = useElementsContext();
  const getHeightAndWidth = (
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number
  ) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return {
      aspectRatio: ratio,
      height: srcHeight * ratio,
      width: srcWidth * ratio,
    };
  };
  const addPhoto = (
    img: string,
    name: string,
    imgWidth: number | undefined = undefined,
    imgHeight: number | undefined = undefined,
    data: any = undefined
  ) => {
    const image = new window.Image();
    image.src = data ? "data:image/svg+xml;base64," + window.btoa(data) : img;
    image.crossOrigin = "anonymous";
    if (imgHeight) {
      image.height = imgHeight;
    }
    if (imgWidth) {
      image.width = imgWidth;
    }
    image.addEventListener("load", () => {
      const { width, height } = getHeightAndWidth(
        imgWidth ?? image.width,
        imgHeight ?? image.height,
        canvas.width - 40,
        canvas.height - 40
      );
      const [element] = addElement<Konva.ShapeConfig>({
        type: "image",
        name,
        image,
        width: imgWidth ?? width,
        height: imgHeight ?? height,
        x: canvas.height / 2,
        y: canvas.width / 2,
        src: img,
      });
      setSelected(element.id);
      setMultiSelectIds(new Set());
    });
  };
  const addShape = (shape: string, name: string, data: any = undefined) => {
    const [element] = addElement<Konva.ShapeConfig>({
      type: shape,
      ...(shape === "path"
        ? {
            name,
            d: svgPath(data.children[0].attributes.d).scale(2).toString(),
            height: data.attributes.height * 2,
            width: data.attributes.width * 2,
            x: canvas.height / 2,
            y: canvas.width / 2,
          }
        : {}),
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
    });
    setSelected(element.id);
    setMultiSelectIds(new Set());
  };
  const addFlatSVG = (name: string, data: any = undefined) => {
    const [element] = addElement<Konva.ShapeConfig>({
      type: "flat-svg",
      name,
      ...data,
      height: data.height,
      width: data.width,
      x: canvas.height / 2,
      y: canvas.width / 2,
    });
    setSelected(element.id);
    setMultiSelectIds(new Set());
  };
  const addNewElement = async (
    type: string,
    element_url: string,
    name: string
  ) => {
    switch (type) {
      case "image":
        addPhoto(element_url, name);
        break;
      case "basic_element":
        try {
          const res = await fetch(element_url);
          const data = await res.text();
          const shapeData = await parse(data);
          addShape("path", name, shapeData);
        } catch (error) {
          console.error(error);
        }
        break;
      case "uneditable_shapes":
        try {
          const res = await fetch(element_url);
          const data = await res.text();
          const parsedData = await parse(
            data
              .replace(/\n|\t/g, "")
              .replace("white", "#ffffff")
              .replace("black", "#000000")
          );
          addPhoto(
            element_url,
            name,
            parseInt(parsedData.attributes.width) * 2,
            parseInt(parsedData.attributes.height) * 2,
            data
          );
        } catch (error) {
          console.error(error);
        }
        break;
      case "complex_element":
        try {
          const res = await fetch(element_url);
          const data = await res.text();
          const parsedData = await parse(
            data
              .replace(/\n|\t/g, "")
              .replace("white", "#ffffff")
              .replace("black", "#000000")
          );
          if (data.includes("url(")) {
            throw Error('Wrong Type use "uneditable_shapes" as type');
          } else {
            const shapeData = {
              height: parseInt(parsedData.attributes.height),
              width: parseInt(parsedData.attributes.width),
              data: parsedData.children.map(({ name, attributes }) => ({
                ...attributes,
                type: name,
              })),
            };
            addFlatSVG(name, shapeData);
          }
        } catch (error: any) {
          console.error(error.message);
        }
        break;
      default:
    }
  };

  return (
    <Fragment>
      <Box
        alignItems="baseline"
        display="flex"
        justifyContent="space-between"
        marginBottom={1.25}
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
          {category_name}
        </Typography>
        <Link
          component="button"
          underline="hover"
          onClick={() => toggleViewCategory(category_id)}
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
        marginBottom={5}
        marginTop={-0.75}
        marginX={-0.75}
      >
        <Masonry columns={gird_size} spacing={1.25} sx={{ m: 0 }}>
          {elements.map(
            (
              { id, name, thumb_url, element_url, type }: I_Elements,
              i: number
            ) => (
              <Card
                key={i}
                id={`${id}`}
                sx={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  borderRadius: 0,
                }}
              >
                <Box
                  component={Button}
                  minWidth={"unset"}
                  padding={0}
                  borderRadius={0}
                  onClick={() => addNewElement(type, element_url, name)}
                >
                  <CardMedia component="img" image={thumb_url} alt={name} />
                </Box>
              </Card>
            )
          )}
        </Masonry>
      </Box>
    </Fragment>
  );
};

export default Featured;
