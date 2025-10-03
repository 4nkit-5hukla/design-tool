import React from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  FormControl,
  FilledInput,
  InputAdornment,
} from "@mui/material";
import { Masonry } from "@mui/lab";
import { Search } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";
import Konva from "konva";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

const style = makeStyles((theme: Theme) => ({
  photos: {},
}));

const Photos = () => {
  const { canvas, setMultiSelectIds } = useAppState();
  const { addElement, setSelected } = useElementsContext();
  const classes = style();
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
  const addPhoto = (img: any, name: any) => {
    const image = new window.Image();
    image.src = img;
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      const { width, height } = getHeightAndWidth(
        image.width,
        image.height,
        canvas.width - 40,
        canvas.height - 40
      );
      const [element] = addElement<Konva.ShapeConfig>({
        type: "image",
        name,
        image,
        width,
        height,
        y: canvas.height / 2,
        x: canvas.width / 2,
      });
      setSelected(element.id);
      setMultiSelectIds(new Set());
    });
  };

  return (
    <Box
      className={classes.photos}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Box paddingX={1} paddingTop={1.5}>
        <FormControl
          className="search-box"
          variant="filled"
          sx={{ width: "100%", height: "42px", mb: 1 }}
        >
          <FilledInput
            placeholder="Search for a template"
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
      <Box flex="1 0 0" paddingX={"14px"} overflow="auto scroll">
        <Masonry columns={2} spacing={1.25} sx={{ m: 0 }}>
          {[
            {
              img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
              title: "Fern",
            },
            {
              img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f",
              title: "Snacks",
            },
            {
              img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
              title: "Mushrooms",
            },
            {
              img: "https://images.unsplash.com/photo-1529655683826-aba9b3e77383",
              title: "Tower",
            },
            {
              img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
              title: "Sea star",
            },
            {
              img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
              title: "Honey",
            },
            {
              img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
              title: "Basketball",
            },
            {
              img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
              title: "Breakfast",
            },
            {
              img: "https://images.unsplash.com/photo-1627328715728-7bcc1b5db87d",
              title: "Tree",
            },
            {
              img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
              title: "Burger",
            },
            {
              img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
              title: "Camera",
            },
            {
              img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
              title: "Coffee",
            },
            {
              img: "https://images.unsplash.com/photo-1627000086207-76eabf23aa2e",
              title: "Camping Car",
            },
            {
              img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
              title: "Hats",
            },
            {
              img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
              title: "Tomato basil",
            },
            {
              img: "https://images.unsplash.com/photo-1627328561499-a3584d4ee4f7",
              title: "Mountain",
            },
            {
              img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
              title: "Bike",
            },
          ].map(({ img, title }, index) => (
            <Card key={index}>
              <Box
                component={Button}
                padding={0}
                onClick={() => addPhoto(`${img}?w=1000&auto=format`, title)}
              >
                <CardMedia
                  component="img"
                  image={`${img}?w=162&auto=format`}
                  srcSet={`${img}?w=162&auto=format&dpr=2 2x`}
                  alt={title}
                />
              </Box>
            </Card>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
};

export default Photos;
