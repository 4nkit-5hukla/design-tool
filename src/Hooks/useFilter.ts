export const useFilter = ({ selected, updateElement }: any) => {
  const previewFilter =
    ({ type }: any) =>
    (value: any) => {
      updateElement(
        {
          id: selected,
          [type]: value,
        },
        {
          saveHistory: false,
        }
      );
    };

  const applyFilter =
    ({ type }: any) =>
    (value: any) => {
      updateElement({
        id: selected,
        [type]: value,
      });
    };

  return {
    applyFilter,
    previewFilter,
  };
};
