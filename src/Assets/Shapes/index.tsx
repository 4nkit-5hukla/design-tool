export * from "./Circle";
export * from "./Chat";
export * from "./Square";
export * from "./Star";
export * from "./Triangle";

export const RenderSolidShape = ({ d, fill, width, height }: any) => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    xmlns="//www.w3.org/2000/svg"
  >
    <path d={d} fill={fill} />
  </svg>
);
