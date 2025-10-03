import { useEffect, useRef } from "react";

export const useEventListener = (
  eventType: string,
  callback: (event: any) => void,
  element: HTMLElement | Document | Window = window
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;
    const handler = (event: any) => callbackRef.current(event);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
};
