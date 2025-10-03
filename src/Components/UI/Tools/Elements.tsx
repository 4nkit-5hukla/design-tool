import { useAppState } from "Contexts/AppState";

import AllElements from "./Elements/all";
import Category from "./Elements/category";
import UnsplashImages from "./Elements/unsplash-images";

const Elements = () => {
  const { viewCategory } = useAppState();

  return (() => {
    switch (viewCategory) {
      case "unsplash":
        return <UnsplashImages />;
      case "all":
        return <AllElements />;
      default:
        return <Category categoryId={viewCategory} />;
    }
  })();
};

export default Elements;
