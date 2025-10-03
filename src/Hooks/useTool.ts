import { useState } from "react";

export const useTool = () => {
  const [usingTool, toggleUsingTool] = useState(false);

  return {
    usingTool,
    toggleUsingTool,
  };
};
