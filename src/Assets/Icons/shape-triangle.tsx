import { triangle } from "Assets/Shapes";

export const Triangle = () => {
  const { d, fill, width, height } = triangle;
  return (
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
};

export default Triangle;
