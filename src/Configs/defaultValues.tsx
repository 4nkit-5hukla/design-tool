export const swatchColor: string[] = [
  "#000000",
  "#545454",
  "#737373",
  "#A6A6A6",
  "#D9D9D9",
  "#FFFFFF",
  "#FA2125",
  "#FA5A5B",
  "#FA6CC2",
  "#C771E3",
  "#875CFA",
  "#5930E7",
  "#20989D",
  "#2BC1C9",
  "#66E0E5",
  "#42B7FC",
  "#5077FB",
  "#024FAA",
  "#1B7E3A",
  "#85D75F",
  "#CADF6C",
  "#FFDC65",
  "#FDBB61",
  "#FB9054",
];

export const isClient = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

const constructColor = (hexString: string) => {
  const hex = hexString.replace(/#/g, "");
  /* Get the RGB values to calculate the Hue. */
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  /* Getting the Max and Min values for Chroma. */
  const max = Math.max.apply(Math, [r, g, b]);
  const min = Math.min.apply(Math, [r, g, b]);

  /* Variables for HSV value of hex color. */
  let chr = max - min;
  let hue = 0;
  let val = max;
  let sat = 0;

  if (val > 0) {
    /* Calculate Saturation only if Value isn't 0. */
    sat = chr / val;
    if (sat > 0) {
      if (r === max) {
        hue = 60 * ((g - min - (b - min)) / chr);
        if (hue < 0) {
          hue += 360;
        }
      } else if (g === max) {
        hue = 120 + 60 * ((b - min - (r - min)) / chr);
      } else if (b === max) {
        hue = 240 + 60 * ((r - min - (g - min)) / chr);
      }
    }
  }
  const colorObj: { hue: number; hex: string } = { hue, hex: hexString };
  return colorObj;
};

export const sortColorsByHue = (colors: string[] | undefined) => {
  return (
    colors &&
    colors
      .map((color: string) => constructColor(color))
      .sort((a, b) => {
        return a.hue - b.hue;
      })
      .map((color) => color.hex)
  );
};
