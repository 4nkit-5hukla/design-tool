/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Divider,
  Typography,
  FormControl,
  FilledInput,
  InputAdornment,
  List,
  ListItemButton,
  ListItem,
  Alert,
} from "@mui/material";
import { Check, Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import WebFontLoader from "webfontloader";

import { useElementsContext } from "Contexts/Elements";
import { useAxios, useDebounce } from "Hooks";
import { useAppState } from "Contexts/AppState";

const FontFamily = () => {
  const { AuthenticatedReq } = useAxios();
  const { safeFonts, fontsMeta, setFontsMeta, fontsData, setFontsData } =
    useAppState();
  const { updateElement, selectedEl, designFonts } = useElementsContext();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontFilter, setFontFilter] = useState<string>("");
  const fontFilterValue = useDebounce(fontFilter);
  const [pageNo, setPageNo] = useState<number>(1);
  const selectFont = (fontName: string) => {
    if (!selectedEl.lock && selectedEl.fontFamily !== fontName) {
      if (safeFonts.includes(fontName)) {
        setFontFamily(fontName);
        updateElement({
          id: selectedEl.id,
          fontFamily: fontName,
        });
      } else {
        setFontFamily(fontName);
        WebFontLoader.load({
          google: {
            families: [fontName],
          },
          fontactive: (familyName) => {
            if (familyName === fontName) {
              updateElement({
                id: selectedEl.id,
                fontFamily: fontName,
              });
            }
          },
        });
      }
    }
  };
  const fontSearch = useCallback(async () => {
    try {
      const startPage = 1;
      setSearchError("");
      setPageNo(startPage);
      const { api_error, data } = await AuthenticatedReq(
        `/fonts/search?query=${fontFilterValue}&limit=${10}&page=${startPage}`
      );
      if (api_error) {
        throw Error(api_error);
      }
      if (data.payload.error) {
        throw Error(data.payload.error);
      }
      setFontsMeta(data.payload.meta);
      setFontsData(data.payload.data);
    } catch (error: any) {
      setSearchError(error.message);
      console.error(error);
    }
  }, [fontFilterValue]);
  const doLoadMore = () => {
    getLoadMore(pageNo + 1);
  };
  const getLoadMore = async (pageNo: number) => {
    try {
      setLoadingMore(true);
      setPageNo(pageNo);
      const { api_error, data } = await AuthenticatedReq(
        `/fonts/search?query=${fontFilterValue}&limit=${10}&page=${pageNo}`
      );
      if (api_error) {
        throw Error(api_error);
      }
      setFontsMeta(data.payload.meta);
      setFontsData([...fontsData, ...data.payload.data]);
      setLoadingMore(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fontSearch();
  }, [fontSearch]);

  useEffect(() => {
    selectedEl && setFontFamily(selectedEl.fontFamily);
  }, [selectedEl]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box>
        <Box paddingX={1}>
          <FormControl
            className="search-box"
            variant="filled"
            sx={{ width: "100%", height: "42px", mt: 1.75, mb: 0 }}
          >
            <FilledInput
              placeholder="Search for a font"
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
              value={fontFilter}
              onChange={({ target: { value } }: any) => setFontFilter(value)}
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
        <Box
          borderBottom="1px solid #24272C1A"
          marginBottom={1.5}
          paddingX={2.5}
          paddingTop={1.75}
          paddingBottom={1.5}
        >
          <List sx={{ py: 0 }}>
            {designFonts.map((fontName, index) => (
              <ListItemButton
                selected={fontFamily === fontName}
                key={index}
                onClick={() => selectFont(fontName)}
                sx={{
                  alignItems: "center",
                  borderRadius: 0.375,
                  justifyContent: "space-between",
                  px: 0.75,
                  py: 1,

                  "&.Mui-selected": {
                    backgroundColor: "#CDDBE3",

                    "&:hover": {
                      backgroundColor: "#CDDBE3",
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#24272CB3",
                    fontFamily: fontName,
                    fontSize: "18px",
                    lineHeight: "22px",
                  }}
                >
                  {fontName}
                </Typography>
                {fontFamily === fontName && <Check />}
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>
      <Box
        flex="1 0 0"
        overflow="auto"
        paddingLeft={1.875}
        paddingRight={0.875}
        marginBottom={1.5}
        sx={{
          "& .MuiCollapse-root.more-filters": {
            height: 0,
          },
        }}
      >
        <Typography
          sx={{
            color: "#24272CB3",
            fontSize: "22px",
            fontWeight: 400,
            lineHeight: "24px",
            textAlign: "center",
          }}
        >
          System Fonts
        </Typography>
        <Divider sx={{ ml: -1.875, mr: -0.875, mt: 1 }} />
        <List sx={{ py: 0 }}>
          {safeFonts
            .filter((fontName: string) =>
              fontName.toLowerCase().includes(fontFilter)
            )
            .map((fontName: string, index: number) => (
              <ListItemButton
                key={index}
                onClick={() => selectFont(fontName)}
                sx={{
                  borderRadius: 0.375,
                  px: 0.75,
                  py: 1,

                  "&.Mui-selected": {
                    backgroundColor: "#CDDBE3",

                    "&:hover": {
                      backgroundColor: "#CDDBE3",
                    },
                  },
                }}
              >
                <Typography
                  sx={{
                    color: "#24272CB3",
                    fontFamily: fontName,
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "22px",
                  }}
                >
                  {fontName}
                </Typography>
              </ListItemButton>
            ))}
          <Divider sx={{ ml: -1.875, mr: -0.875, mb: 1 }} />
          <Typography
            sx={{
              color: "#24272CB3",
              fontSize: "22px",
              fontWeight: 400,
              lineHeight: "24px",
              textAlign: "center",
            }}
          >
            Google Fonts
          </Typography>
          <Divider sx={{ ml: -1.875, mr: -0.875, mt: 1 }} />
          {searchError && (
            <ListItem sx={{ px: 0 }}>
              <Alert severity="error" sx={{ width: "100%" }}>
                {searchError}
              </Alert>
            </ListItem>
          )}
          {fontsData &&
            searchError === "" &&
            fontsData.map(({ font_family, font_image }: any, index: number) => (
              <ListItemButton
                key={index}
                onClick={() => {
                  // setLoadFont(font_family);
                  selectFont(font_family);
                }}
                sx={{
                  borderRadius: 0.375,
                  px: 0.75,
                  py: 1,

                  "&.Mui-selected": {
                    backgroundColor: "#CDDBE3",

                    "&:hover": {
                      backgroundColor: "#CDDBE3",
                    },
                  },
                }}
              >
                {font_image ? (
                  <Box
                    component="img"
                    src={font_image}
                    alt={font_family}
                    loading="lazy"
                    sx={{ maxWidth: "100%", height: "auto", maxHeight: 20 }}
                  />
                ) : (
                  <Typography
                    sx={{
                      color: "#24272CB3",
                      fontFamily: font_family,
                      fontSize: "18px",
                      lineHeight: "22px",
                    }}
                  >
                    {font_family}
                  </Typography>
                )}
              </ListItemButton>
            ))}
        </List>
        {fontsMeta && fontsMeta.next_page_url && (
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

export default FontFamily;
