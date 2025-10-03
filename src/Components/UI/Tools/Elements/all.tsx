/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { useAxios } from "Hooks";

import Featured from "./featured";
import SomeUnsplashImages from "./some-unsplash-images";

const AllElements = () => {
  const { AuthenticatedReq } = useAxios();
  const [featuredElements, setFeaturedElements] = useState<any[]>([]);
  const getFeaturedElements = useCallback(async () => {
    try {
      const result = await AuthenticatedReq("/element/featured_elements");
      // const result = await AuthenticatedReq("/featured.json");
      setFeaturedElements(result.data.payload);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getFeaturedElements();
  }, [getFeaturedElements]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        flex="1 0 0"
        overflow="auto"
        paddingX={2.5}
        paddingY={1.75}
        sx={{
          "& .MuiCollapse-root.more-filters": {
            height: 0,
          },
          "& > .MuiBox-root": {
            "&:last-child": {
              marginBottom: 0,
            },
          },
        }}
      >
        <SomeUnsplashImages />
        {featuredElements && featuredElements.length > 0 &&
          featuredElements.map(
            ({ category_id, category_name, gird_size, elements }, index) => (
              <Featured
                key={category_id}
                {...{
                  index,
                  category_id,
                  category_name,
                  gird_size,
                  elements,
                }}
              />
            )
          )}
      </Box>
    </Box>
  );
};

export default AllElements;
