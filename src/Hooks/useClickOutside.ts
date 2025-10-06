import { RefObject } from "react";
import { useEventListener } from "./useEventListener";

export const useClickOutside = (
  ref: RefObject<HTMLElement>, 
  callback: (e: MouseEvent) => void
) => {
  useEventListener(
    "click",
    (e: MouseEvent) => {
      if (ref.current == null || ref.current.contains(e.target as Node)) return;
      callback(e);
    },
    document
  );
};
