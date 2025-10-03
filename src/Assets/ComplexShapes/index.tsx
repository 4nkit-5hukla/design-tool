const mapCallBack = ({ type, ...rest }: any, index: number) =>
  type === "group"
    ? (({ descendants, globalCompositeOperation, ...groupProps }) => (
        <g key={index} {...groupProps}>
          {descendants.map(mapCallBack)}
        </g>
      ))(rest)
    : ((pathProps) => <path key={index} {...pathProps} />)(rest);

export const RenderShape = ({ width, height, data }: any) => (
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
