import { Masonry } from "@mui/lab";
import { Box, Button, Card, CardMedia, Typography } from "@mui/material";
import { useElementsContext } from "Contexts/Elements";

const ShapeClip = () => {
  const { selectedEl } = useElementsContext();
  const { updateElement } = useElementsContext();

  const addClippedImage = (src: string, title: string) => {
    const { x, y, scaleX, scaleY, rotation, id } = selectedEl;
    const image = new window.Image();
    image.src = src;
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      const aspectRatio = image.width / image.height;
      const shapeWidth = selectedEl.width * scaleX;
      const shapeHeight = selectedEl.height * scaleY;
      const wide = aspectRatio > shapeWidth / shapeHeight;
      const width = wide ? shapeHeight * aspectRatio : shapeWidth;
      const height = wide ? shapeHeight : shapeWidth / aspectRatio;
      updateElement({
        id,
        type: "clippedImage",
        name: title,
        image,
        imageDeltaX: 0,
        imageDeltaY: 0,
        imageWidth: width,
        imageHeight: height,
        shapeX: x,
        shapeY: y,
        shapeWidth,
        shapeHeight,
        rotation: rotation ? rotation : 0,
        isClipping: false,
        src,
        flipX: false,
        flipY: false,
        svgPath: selectedEl.d,
        shapeElement: selectedEl,
      });
    });
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box paddingX={2.5} paddingY={1.75} marginBottom={2.5}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            color: "#24272CB3",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
          }}
        >
          {"Clip Image"}
        </Typography>
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
              <Box component={Button} padding={0}>
                <CardMedia
                  component="img"
                  image={`${img}?w=162&auto=format`}
                  srcSet={`${img}?w=162&auto=format&dpr=2 2x`}
                  alt={title}
                  onClick={() => addClippedImage(img, title)}
                />
              </Box>
            </Card>
          ))}
        </Masonry>
      </Box>
    </Box>
  );
};

export default ShapeClip;
