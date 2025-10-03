/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  FilledInput,
  FormControl,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { LoadingButton, Masonry } from "@mui/lab";

import { useElementsContext } from "Contexts/Elements";
import { useAxios, useDebounce } from "Hooks";
import { useAppState } from "Contexts/AppState";
import WebFontLoader from "webfontloader";

const Templates = () => {
  const { AuthenticatedReq } = useAxios();
  const { setElements, setLoadingTemplate, setTemplateImage } =
    useElementsContext();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);
  const [templateFilter, setTemplateFilter] = useState<string>("");
  const templateFilterValue = useDebounce(templateFilter);
  const [pageNo, setPageNo] = useState<number>(1);
  const [templatesData, setTemplatesData] = useState<any[]>([]);
  const [templatesMeta, setTemplatesMeta] = useState<any>();
  const { safeFonts } = useAppState();
  const loadTemplate = async (
    templateFile: string,
    templateThumbnail: string
  ) => {
    setLoadingTemplate(true);
    setTemplateImage(templateThumbnail);
    const res = await fetch(templateFile);
    const data = await res.json();

    const fontsToLoad: string[] = data
      .filter((e: any) => e.type === "text")
      .map((e: any) => e.fontFamily)
      .filter((font: string) => !safeFonts.includes(font));
    let fontsActive = 0;
    const families = Array.from(new Set(fontsToLoad));
    WebFontLoader.load({
      google: { families },
      fontactive: () => {
        fontsActive++;
        if (fontsActive < families.length) return;
        setElements(data);
        setLoadingTemplate(false);
        setTemplateImage("");
      },
    });
  };
  const templateSearch = useCallback(async () => {
    try {
      const startPage = 1;
      setSearching(true);
      setSearchError("");
      setPageNo(startPage);
      const { api_error, data } = await AuthenticatedReq(
        `/template/search?query=${templateFilterValue}&limit=${10}&page=${startPage}`
      );
      if (api_error) {
        throw Error(api_error);
      }
      if (data.error) {
        throw Error(data.error);
      }
      setTemplatesMeta(data.new_meta);
      setTemplatesData(data.data);
      setSearching(false);
    } catch (error: any) {
      setSearchError(error.message);
      setSearching(false);
      console.error(error);
    }
  }, [templateFilterValue]);
  const doLoadMore = () => {
    getLoadMore(pageNo + 1);
  };
  const getLoadMore = async (pageNo: number) => {
    try {
      setLoadingMore(true);
      setPageNo(pageNo);
      const { api_error, data } = await AuthenticatedReq(
        `/fonts/search?query=${templateFilterValue}&limit=${10}&page=${pageNo}`
      );
      if (api_error) {
        throw Error(api_error);
      }
      setTemplatesData(data.new_meta);
      setTemplatesData([...templatesData, ...data.data]);
      setLoadingMore(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    templateSearch();
  }, [templateSearch]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box paddingX={1} paddingTop={1.5}>
        <FormControl
          className="search-box"
          variant="filled"
          sx={{ width: "100%", height: "42px", mt: 1.75, mb: 0 }}
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
            value={templateFilter}
            onChange={({ target: { value } }: any) => setTemplateFilter(value)}
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
          display="flex"
          columnGap={3.5}
          justifyContent="space-evenly"
          marginBottom={1.25}
          marginTop={-0.75}
          marginX={-0.75}
        >
          {!searching && searchError !== "" && (
            <Alert severity="error">{searchError}</Alert>
          )}
          {!searching && templatesData.length === 0 && (
            <Alert severity="error">
              No Templates found for "{templateFilterValue}"
            </Alert>
          )}
          {!searching && searchError === "" && templatesData.length > 0 && (
            <Masonry columns={2} spacing={1.25} sx={{ m: 0 }}>
              {templatesData.map(
                (
                  {
                    template_thumbnail,
                    name,
                    template_file,
                    category,
                    tags,
                  }: any,
                  index: number
                ) => (
                  <Card key={index}>
                    <Box
                      component={Button}
                      padding={0}
                      onClick={() =>
                        loadTemplate(template_file, template_thumbnail)
                      }
                      title={`${category}: ${name}, Tags: [${tags
                        .split(",")
                        .join(", ")}]`}
                    >
                      <CardMedia
                        component="img"
                        image={template_thumbnail}
                        alt={name}
                      />
                    </Box>
                  </Card>
                )
              )}
            </Masonry>
          )}
        </Box>
        {templatesMeta && templatesMeta.next_page_url && (
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

export default Templates;
