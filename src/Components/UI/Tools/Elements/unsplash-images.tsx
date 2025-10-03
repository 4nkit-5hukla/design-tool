/* eslint-disable react-hooks/exhaustive-deps */
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import { ArrowBack, Close } from "@mui/icons-material";
import { Masonry, LoadingButton } from "@mui/lab";
import { OrderBy } from "unsplash-js";
import Konva from "konva";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { useUnSplash } from "Hooks";
import { I_Photos } from "Interfaces";

const AllImages = () => {
  const unSplash = useUnSplash();
  const { canvas, viewCategory, toggleViewCategory, setMultiSelectIds } = useAppState();
  const { unSelect, unFocus } = useElementsContext();
  const maxHeight: number = canvas.height - 40;
  const maxWidth: number = canvas.width - 40;
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [photos, setPhotos] = useState<I_Photos[]>([]);
  const [totalPhotos, setTotalPhotos] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchPageNo, setSearchPageNo] = useState<number>(0);
  const { addElement, setSelected } = useElementsContext();
  const addPhoto = (
    img: string,
    name: string,
    imageHeight: number,
    imageWidth: number,
    aspectRatio: number
  ) => {
    const image = new window.Image();
    image.src = img;
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      const [element] = addElement<Konva.ShapeConfig>({
        type: "image",
        name,
        image,
        width: imageWidth * aspectRatio,
        height: imageHeight * aspectRatio,
        x: canvas.height / 2,
        y: canvas.width / 2,
        src: img,
      });
      setSelected(element.id);
      setMultiSelectIds(new Set());
    });
  };
  const searchUnsplashPhotos = async (
    searchTerm: string,
    searchPageNo: number
  ) => {
    try {
      searchPageNo === 1 && setSearching(true);
      const { errors, response } = await unSplash.search.getPhotos({
        query: searchTerm,
        page: searchPageNo,
        perPage: 20,
        orderBy: OrderBy.LATEST,
      });
      if (errors) {
        throw Error(errors[0]);
      }
      if (response) {
        const { results, total } = response;
        totalPhotos === 0 && setTotalPhotos(total);
        searchPageNo === 1 && setPhotos([]);
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          ...results.map(
            ({
              id,
              alt_description,
              description,
              height,
              width,
              urls: { full, thumb },
              user: { username },
            }) => ({
              id,
              urls: { full, thumb },
              height,
              width,
              aspectRatio: Math.min(maxWidth / width, maxHeight / height),
              title: alt_description ?? description ?? `@${username}`,
            })
          ),
        ]);
        setSearching(false);
        setLoadingMore(false);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };
  const doLoadMore = () => {
    setLoadingMore(true);
    if (searchTerm !== "") {
      const nextSearchPageNo = searchPageNo + 1;
      setSearchPageNo(nextSearchPageNo);
      searchUnsplashPhotos(searchTerm, nextSearchPageNo);
    } else {
      setPageNo((pageNo) => pageNo + 1);
    }
  };
  const doSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchValue !== "" && searchValue !== searchTerm) {
      const firstSearchPageNo =
        searchValue !== searchTerm ? 1 : searchPageNo + 1;
      setSearchTerm(searchValue);
      setSearchPageNo(firstSearchPageNo);
      searchUnsplashPhotos(searchValue, firstSearchPageNo);
    }
  };
  const clearSearch = () => {
    if (searchValue !== "") {
      setSearchValue("");
      setSearchTerm("");
    }
  };
  const getUnsplashPhotos = useCallback(async () => {
    try {
      if (searchTerm !== "") {
        return;
      }
      if (searchPageNo > 0) {
        setPhotos([]);
        setSearchPageNo(0);
      }
      const { errors, response } = await unSplash.photos.list({
        page: pageNo,
        perPage: 20,
        orderBy: OrderBy.LATEST,
      });
      if (errors) {
        throw Error(errors[0]);
      }
      if (response) {
        const { results, total } = response;
        totalPhotos === 0 && setTotalPhotos(total);
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          ...results.map(
            ({
              id,
              alt_description,
              description,
              height,
              width,
              urls: { full, thumb },
              user: { username },
            }) => ({
              id,
              urls: { full, thumb },
              height,
              width,
              aspectRatio: Math.min(maxWidth / width, maxHeight / height),
              title: alt_description ?? description ?? `@${username}`,
            })
          ),
        ]);
        setSearching(false);
        setLoadingMore(false);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  }, [searchTerm, pageNo]);

  useEffect(() => {
    getUnsplashPhotos();
  }, [getUnsplashPhotos]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box component="form" paddingX={1} paddingTop={1.5} onSubmit={doSearch}>
        <FormControl
          className="search-box"
          variant="filled"
          sx={{ width: "100%", height: "42px", mb: 1 }}
        >
          <FilledInput
            placeholder={
              viewCategory === 0 ? `Search any Element` : `Type to Search`
            }
            onFocus={() => {
              unSelect();
              unFocus();
            }}
            onChange={({
              target: { value },
            }: ChangeEvent<HTMLInputElement>) => {
              setSearchValue(value);
            }}
            value={searchValue}
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
                    toggleViewCategory("all");
                  }}
                >
                  <ArrowBack />
                </IconButton>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  color: "#24272C80",
                  mt: "0!important",
                  mr: "0!important",
                }}
              >
                {searchValue !== "" && (
                  <IconButton onClick={clearSearch}>
                    <Close />
                  </IconButton>
                )}
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
        </Box>
        <Box
          display="flex"
          columnGap={3.5}
          justifyContent="space-evenly"
          marginBottom={1.25}
          marginTop={-0.75}
          marginX={-0.75}
        >
          {!searching && photos.length > 0 && (
            <Masonry columns={2} spacing={1.25} sx={{ m: 0 }}>
              {photos.map(
                (
                  {
                    id,
                    aspectRatio,
                    title,
                    height,
                    width,
                    urls: { full, thumb },
                  }: I_Photos,
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
                          width,
                          aspectRatio
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
          {!searching && photos.length === 0 && (
            <Alert severity="error">No Images found for "{searchValue}"</Alert>
          )}
        </Box>
        {photos.length > 0 && photos.length < totalPhotos && (
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
      </Box>
    </Box>
  );
};

export default AllImages;
