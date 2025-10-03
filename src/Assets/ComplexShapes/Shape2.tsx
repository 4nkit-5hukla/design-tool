import { shape2data } from "./data";

const { width, height, data } = shape2data;

const mapCallBack = ({ type, ...rest }: any, index: number) =>
  type === "group" ? (
    (({ descendants, globalCompositeOperation, ...groupProps }) => (
      <g key={index} {...groupProps}>
        {descendants.map(mapCallBack)}
      </g>
    ))(rest)
  ) : (
    <path key={index} {...rest} />
  );

export const Shape2 = () => (
  <svg
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    xmlns="//www.w3.org/2000/svg"
  >
    {data.map(mapCallBack)}
  </svg>
);
