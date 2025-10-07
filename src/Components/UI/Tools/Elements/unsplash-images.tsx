import {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
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
import Konva from "konva";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { useUnsplashImages } from "hooks/useUnsplashImages";

const AllImages = () => {
  const { canvas, viewCategory, toggleViewCategory, setMultiSelectIds } = useAppState();
  const { unSelect, unFocus, addElement, setSelected } = useElementsContext();
  const maxHeight: number = canvas.height - 40;
  const maxWidth: number = canvas.width - 40;
  const [searchValue, setSearchValue] = useState<string>("");
  
  const { 
    images, 
    loading, 
    error, 
    hasMore, 
    searchImages, 
    loadMore 
  } = useUnsplashImages();
  const addPhoto = (imageUrl: string, name: string, imageWidth: number, imageHeight: number) => {
    const image = new window.Image();
    image.src = imageUrl;
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      const aspectRatio = Math.min(maxWidth / imageWidth, maxHeight / imageHeight);
      const [element] = addElement({
        type: "image",
        name,
        image,
        width: imageWidth * aspectRatio,
        height: imageHeight * aspectRatio,
        x: canvas.height / 2,
        y: canvas.width / 2,
        src: imageUrl,
      } as any);
      setSelected(element.id);
      setMultiSelectIds(new Set());
    });
  };

  const doSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchValue.trim()) {
      searchImages(searchValue.trim());
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    searchImages("latest");
  };

  useEffect(() => {
    searchImages("latest");
  }, []);

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
          {error && (
            <Alert severity="error">{error}</Alert>
          )}
          {!error && images.length > 0 && (
            <Masonry columns={2} spacing={1.25} sx={{ m: 0 }}>
              {images.map((image) => {
                const imageUrl = `${image.urls.raw}&w=${Math.ceil(canvas.width * 1.5)}&h=${Math.ceil(canvas.height * 1.5)}&fit=crop`;
                const title = image.alt_description || image.description || `Photo by ${image.user.name}`;
                
                return (
                  <Card key={image.id}>
                    <Box
                      component={Button}
                      padding={0}
                      onClick={() => addPhoto(imageUrl, title, image.width, image.height)}
                      title={title}
                    >
                      <CardMedia component="img" image={image.urls.thumb} alt={title} />
                    </Box>
                  </Card>
                );
              })}
            </Masonry>
          )}
          {!loading && !error && images.length === 0 && (
            <Alert severity="info">Search for images to add to your design</Alert>
          )}
        </Box>
        {hasMore && images.length > 0 && (
          <Box display="flex" justifyContent="center">
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={loadMore}
              loading={loading}
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
