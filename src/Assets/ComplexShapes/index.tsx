interface ShapeData {
  type: string;
  descendants?: ShapeData[];
  globalCompositeOperation?: string;
  style?: Record<string, unknown>;
  [key: string]: unknown;
}

interface RenderShapeProps {
  width: number;
  height: number;
  data: ShapeData[];
}

const mapCallBack = ({ type, ...rest }: ShapeData, index: number) =>
  type === "group"
    ? (({ descendants, globalCompositeOperation, ...groupProps }) => (
        <g key={index} {...groupProps}>
          {descendants?.map(mapCallBack)}
        </g>
      ))(rest)
    : ((pathProps) => <path key={index} {...pathProps} />)(rest);

export const RenderShape = ({ width, height, data }: RenderShapeProps) => (
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
