import { FC } from "react";
import { RouteObject, BrowserRouter as Router, useRoutes } from "react-router-dom";

import Home from "Pages/Home";
import Preview from "Pages/Preview";
import NotFound404 from "Pages/404";
import { TestPage } from "pages/TestPage";
import { CanvasProvider } from "contexts/CanvasContext";
import { ElementsProvider } from "contexts/ElementsContext";
import { SelectionProvider } from "contexts/SelectionContext";
import { HistoryAdapter } from "contexts/adapters/HistoryAdapter";

const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/preview", element: <Preview /> },
  { path: "/test", element: <TestPage /> },
  { path: "*", element: <NotFound404 /> },
];

const AppRoutes: FC = () => useRoutes(routes);

const AppRouter: FC = () => {
  return (
    <Router>
      <CanvasProvider>
        <ElementsProvider>
          <SelectionProvider>
            <HistoryAdapter>
              <AppRoutes />
            </HistoryAdapter>
          </SelectionProvider>
        </ElementsProvider>
      </CanvasProvider>
    </Router>
  );
};

export default AppRouter;
