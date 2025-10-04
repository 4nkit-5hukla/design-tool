/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, ReactNode, useContext, useRef, useState, RefObject } from "react";
import Konva from "konva";

interface AppStateProps {
  children: ReactNode;
}

interface FontMeta {
  [key: string]: unknown;
}

interface AppStateContextType {
  canvas: { width: number; height: number };
  setCanvas: (canvas: { width: number; height: number }) => void;
  avgMoveUnit: number;
  rootRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<Konva.Stage | null>;
  editSelected: boolean;
  toggleEditSelected: (value: boolean) => void;
  editTool: string;
  setEditTool: (tool: string) => void;
  editText: boolean;
  toggleEditText: (value: boolean) => void;
  editingData: boolean;
  toggleEditingData: (value: boolean) => void;
  currentColor: string;
  setCurrentColor: (color: string) => void;
  useColorSet: string;
  setColorSet: (colorSet: string) => void;
  multiSelectIds: Set<string>;
  setMultiSelectIds: (ids: Set<string>) => void;
  viewCategory: string | number;
  toggleViewCategory: (category: string | number) => void;
  safeFonts: string[];
  fontsMeta: FontMeta | undefined;
  setFontsMeta: (meta: FontMeta) => void;
  fontsData: unknown[];
  setFontsData: (data: unknown[]) => void;
}

const AppContext = createContext<AppStateContextType | null>(null);

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
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  // States
  const [fontsMeta, setFontsMeta] = useState<FontMeta | undefined>();
  const [fontsData, setFontsData] = useState<unknown[]>([]);
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
  const [multiSelectIds, setMultiSelectIds] = useState<Set<string>>(
    () => new Set()
  );
  // providerValue
  const providerValue: AppStateContextType = {
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
