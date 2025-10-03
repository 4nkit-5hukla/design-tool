import { createApi } from "unsplash-js";

export const useUnSplash = () => {
  return createApi({
    accessKey: import.meta.env.REACT_APP_UNSPLASH_ACCESS_KEY ?? "",
    fetch: window.fetch,
  });
};
