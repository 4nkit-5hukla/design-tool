import { UseFilterParams } from "Interfaces";

export const useFilter = ({ selected, updateElement }: UseFilterParams) => {
  const previewFilter =
    ({ type }: { type: string }) =>
    (value: number | boolean) => {
      updateElement(
        {
          id: selected as string,
          [type]: value,
        },
        {
          saveHistory: false,
        }
      );
    };

  const applyFilter =
    ({ type }: { type: string }) =>
    (value: number | boolean) => {
      updateElement({
        id: selected as string,
        [type]: value,
      });
    };

  return {
    applyFilter,
    previewFilter,
  };
};
