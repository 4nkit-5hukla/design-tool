export * from "./Circle";
export * from "./Chat";
export * from "./Square";
export * from "./Star";
export * from "./Triangle";

interface SolidShapeProps {
  d: string;
  fill: string;
  width: number;
  height: number;
}

export const RenderSolidShape = ({ d, fill, width, height }: SolidShapeProps) => (
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
