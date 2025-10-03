/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useCallback, useEffect, useState } from "react";
import { Box, Button, Card, CardMedia, Link, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";
import { OrderBy } from "unsplash-js";
import Konva from "konva";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { useUnSplash } from "Hooks";
import { I_Photos } from "Interfaces";

const SomeUnsplashImages = () => {
  const unSplash = useUnSplash();
  const { canvas, toggleViewCategory, setMultiSelectIds } = useAppState();
  const maxHeight: number = canvas.height - 40;
  const maxWidth: number = canvas.width - 40;
  const { addElement, setSelected } = useElementsContext();
  const [photos, setPhotos] = useState<I_Photos[]>([]);
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
    imageHeight: number,
    imageWidth: number
  ) => {
    const image = new window.Image();
    image.src = img;
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      const { width, height } = getHeightAndWidth(
        imageWidth,
        imageHeight,
        canvas.width - 40,
        canvas.height - 40
      );
      const [element] = addElement<Konva.ShapeConfig>({
        type: "image",
        name,
        image,
        width,
        height,
        x: canvas.height / 2,
        y: canvas.width / 2,
        src: img,
      });
      setSelected(element.id);
      setMultiSelectIds(new Set());
    });
  };

  const getUnsplashPhotos = useCallback(async () => {
    try {
      const { errors, response } = await unSplash.photos.list({
        page: 1,
        perPage: 6,
        orderBy: OrderBy.LATEST,
      });
      if (errors) {
        throw Error(errors[0]);
      }
      if (response) {
        const { results } = response;
        setPhotos(
          results.map(
            ({
              id,
              alt_description,
              description,
              height,
              width,
              urls: { full, thumb },
              user: { username },
            }) => ({
              aspectRatio: Math.min(maxWidth / width, maxHeight / height),
              id,
              urls: { full, thumb },
              height,
              width,
              title: alt_description ?? description ?? `@${username}`,
            })
          )
        );
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    getUnsplashPhotos();
  }, [getUnsplashPhotos]);

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
          {"Images"}
        </Typography>
        <Link
          component="button"
          underline="hover"
          onClick={() => toggleViewCategory("unsplash")}
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
        {photos.length > 0 && (
          <Masonry columns={2} spacing={1.25} sx={{ m: 0 }}>
            {photos.map(
              (
                { title, height, width, urls: { full, thumb } }: I_Photos,
                index: number
              ) => (
                <Card key={index}>
                  <Box
                    component={Button}
                    padding={0}
                    onClick={() =>
                      addPhoto(
                        `${full}&w=${canvas.width * 1.5}`,
                        title,
                        height,
                        width
                      )
                    }
                    title={title}
                  >
                    <CardMedia component="img" image={thumb} alt={title} />
                  </Box>
                </Card>
              )
            )}
          </Masonry>
        )}
      </Box>
    </Fragment>
  );
};

export default SomeUnsplashImages;
