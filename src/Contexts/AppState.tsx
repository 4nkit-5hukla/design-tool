/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, ReactNode, useContext, useRef, useState } from "react";

interface AppStateProps {
  children: ReactNode;
}

const AppContext = createContext<any>(null);

const AppState = ({ children }: AppStateProps) => {
  const { Provider } = AppContext;
  const safeFonts = [
    "Arial",
    "Arial Black",
    "Calibri",
    "Cambria",
    "Candara",
    "Comic Sans MS",
    "Consolas",
    "Courier",
    "Georgia",
    "Helvetica",
    "Impact",
    "Lucida Console",
    "Segoe UI",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
  ];
  // Refs
  const rootRef = useRef();
  const containerRef = useRef();
  const stageRef = useRef();
  // States
  const [fontsMeta, setFontsMeta] = useState<any>();
  const [fontsData, setFontsData] = useState<any[]>([]);
  const [editSelected, toggleEditSelected] = useState<boolean>(false);
  const [editText, toggleEditText] = useState<boolean>(false);
  const [editingData, toggleEditingData] = useState<boolean>(false);
  const [viewCategory, toggleViewCategory] = useState<string | number>("all");
  const [editTool, setEditTool] = useState<string>("");
  const [currentColor, setCurrentColor] = useState<string>("");
  const [useColorSet, setColorSet] = useState<string>("");
  const [canvas, setCanvas] = useState({
    width: 1080,
    height: 1080,
  });
  const [multiSelectIds, setMultiSelectIds] = useState<Set<String>>(
    () => new Set()
  );
  // providerValue
  const providerValue = {
    canvas,
    setCanvas,
    avgMoveUnit: Math.floor((canvas.width + canvas.height) / 100),
    rootRef,
    containerRef,
    stageRef,
    editSelected,
    toggleEditSelected,
    editTool,
    setEditTool,
    editText,
    toggleEditText,
    editingData,
    toggleEditingData,
    currentColor,
    setCurrentColor,
    useColorSet,
    setColorSet,
    multiSelectIds,
    setMultiSelectIds,
    viewCategory,
    toggleViewCategory,
    safeFonts,
    fontsMeta,
    setFontsMeta,
    fontsData,
    setFontsData,
  };

  return <Provider value={providerValue}>{children}</Provider>;
};

export const useAppState = () => {
  const context = useContext(AppContext);

  if (!context)
    throw new Error("useAppState must be called from within the AppState");

  return context;
};

export default AppState;
