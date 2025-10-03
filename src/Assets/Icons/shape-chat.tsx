import { chat } from "Assets/Shapes";

export const Chat = () => {
  const { d, fill, width, height } = chat;
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

export default Chat;
