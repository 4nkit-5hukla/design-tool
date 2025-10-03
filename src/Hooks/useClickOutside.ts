import { useEventListener } from "./useEventListener";

export const useClickOutside = (ref: any, callback: (e: any) => void) => {
  useEventListener(
    "click",
    (e: any) => {
      if (ref.current == null || ref.current.contains(e.target)) return;
      callback(e);
    },
    document
  );
};
