import { useState } from "react";

export const useStorage = (
  key: string,
  defaultValue: string,
  storageObject: Storage
) => {
  const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return defaultValue;
      }
      // Get from local storage by key
      const jsonValue = storageObject.getItem(key);
      try {
        // Parse stored json or if none return initialValue
        return jsonValue ? JSON.parse(jsonValue) : defaultValue;
      } catch (error: any) {
        return error.name === "SyntaxError" ? jsonValue : defaultValue;
      }
    }),
    setValue = (value: string | Function) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        if (typeof window !== "undefined") {
          storageObject.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };

  return [storedValue, setValue];
};

export const useLocalStorage = (key: string, defaultValue: string) => {
  return useStorage(key, defaultValue, window.localStorage);
};

export const useSessionStorage = (key: string, defaultValue: string) => {
  return useStorage(key, defaultValue, window.sessionStorage);
};
