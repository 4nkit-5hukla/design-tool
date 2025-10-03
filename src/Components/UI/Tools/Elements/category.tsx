/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from "@mui/material";
import { Masonry, LoadingButton } from "@mui/lab";
import Konva from "konva";
import { parse } from "svgson";
import svgPath from "svgpath";

import { useAxios } from "Hooks";
import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { I_Elements, I_Categories, I_Category, I_API_Meta } from "Interfaces";
import { ArrowBack } from "@mui/icons-material";

const Category = ({ categoryId }: any) => {
  const { AuthenticatedReq } = useAxios();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<I_Category>();
  const [categoryMeta, setCategoryMeta] = useState<I_API_Meta>();
  const { canvas, viewCategory, toggleViewCategory, setMultiSelectIds } =
    useAppState();
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
  const doLoadMore = async () => {
    try {
      setLoadingMore(true);
      if (categoryData) {
        const { has_sub_categories, categories, elements } = categoryData;
        const resultBucket = has_sub_categories ? categories : elements;
        if (resultBucket) {
          const data = resultBucket.data;
          const meta = resultBucket.meta;
          if (meta.total > data?.length && meta.next_page_url) {
            const result = await AuthenticatedReq(meta.next_page_url);
            if (result.api_error) {
              throw Error(result.api_error);
            }
            setCategoryData({
              ...categoryData,
              ...(has_sub_categories
                ? {
                    categories: {
                      meta: result.data.categories.meta,
                      data: [...data, ...result.data.categories.data],
                    },
                  }
                : {
                    elements: {
                      meta: result.data.elements.meta,
                      data: [...data, ...result.data.elements.data],
                    },
                  }),
            });
            setCategoryMeta(
              result.data.has_sub_categories
                ? result.data.categories.meta
                : result.data.elements.meta
            );
            setLoadingMore(false);
          }
        }
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const getCategoryData = useCallback(async () => {
    try {
      const result = await AuthenticatedReq(
        `/element/category/${categoryId}?page=1&limit=5`
      );
      // const result = await AuthenticatedReq(
      //   `/category-${categoryId}.json`
      // );
      if (result.api_error) {
        console.log(result.api_error);
        return;
      }
      setCategoryData(result.data);
      setCategoryMeta(
        result.data.has_sub_categories
          ? result.data.categories.meta
          : result.data.elements.meta
      );
    } catch (error: any) {
      console.error(error.message);
    }
  }, [categoryId]);

  useEffect(() => {
    getCategoryData();
  }, [getCategoryData]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box component="form" paddingX={1} paddingTop={1.5}>
        <FormControl
          className="search-box"
          variant="filled"
          sx={{ width: "100%", height: "42px", mb: 1 }}
        >
          <FilledInput
            placeholder={
              viewCategory === 0 ? `Search any Element` : `Type to Search`
            }
            startAdornment={
              <InputAdornment
                position="start"
                sx={{
                  color: "#24272C80",
                  mt: "0!important",
                  mr: "0!important",
                }}
              >
                <IconButton
                  onClick={() => {
                    toggleViewCategory(
                      categoryData?.parent_id !== "null"
                        ? categoryData?.parent_id
                        : "all"
                    );
                  }}
                >
                  <ArrowBack />
                </IconButton>
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
              pl: 0,

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
        {categoryData && (
          <Fragment>
            <Box
              alignItems="baseline"
              display="flex"
              justifyContent="space-between"
              marginBottom={1.25}
            >
              <Typography
                component="h6"
                sx={{
                  color: "#24272CB3",
                  fontSize: "20px",
                  fontWeight: 600,
                  lineHeight: "22px",
                }}
              >
                {categoryData.category_name}
              </Typography>
            </Box>
            {categoryData.has_sub_categories ? (
              categoryData.categories &&
              categoryData.categories.data.map(
                (
                  { category_name, category_id, elements }: I_Categories,
                  i: number
                ) => (
                  <Fragment key={i}>
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

                            "&:hover:not($disabled):not($focused):not($error):before":
                              {
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
                      marginTop={-0.75}
                      marginX={-0.75}
                    >
                      <Masonry columns={3} spacing={1.5} sx={{ m: 0 }}>
                        {elements.map(
                          (
                            {
                              id,
                              name,
                              thumb_url,
                              element_url,
                              type,
                            }: I_Elements,
                            j: number
                          ) => (
                            <Card
                              key={j}
                              id={`${id}`}
                              sx={{
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                borderRadius: 0,
                              }}
                            >
                              <Box
                                component={Button}
                                padding={0}
                                borderRadius={0}
                                minWidth={"unset"}
                                onClick={() =>
                                  addNewElement(type, element_url, name)
                                }
                              >
                                <CardMedia
                                  component="img"
                                  image={thumb_url}
                                  alt={name}
                                />
                              </Box>
                            </Card>
                          )
                        )}
                      </Masonry>
                    </Box>
                  </Fragment>
                )
              )
            ) : (
              <Box
                display="flex"
                columnGap={3.5}
                justifyContent="space-evenly"
                marginBottom={1.25}
                marginTop={-0.75}
                marginX={-0.75}
              >
                {categoryData.elements && (
                  <Masonry columns={3} spacing={1.5} sx={{ m: 0 }}>
                    {categoryData.elements.data.map(
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
                            onClick={() =>
                              addNewElement(type, element_url, name)
                            }
                          >
                            <CardMedia
                              component="img"
                              image={thumb_url}
                              // image={element_url}
                              alt={name}
                            />
                          </Box>
                        </Card>
                      )
                    )}
                  </Masonry>
                )}
              </Box>
            )}
            {categoryMeta && categoryMeta.next_page_url && (
              <Box display="flex" justifyContent="center">
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={doLoadMore}
                  loading={loadingMore}
                >
                  Load More
                </LoadingButton>
              </Box>
            )}
          </Fragment>
        )}
      </Box>
    </Box>
  );
};

export default Category;
