import { FC } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

import Home from "Pages/Home";
import Preview from "Pages/Preview";
import NotFound404 from "Pages/404";

const AppRoutes: FC = () => {
  const routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/preview", element: <Preview /> },
    { path: "*", element: <NotFound404 /> },
  ]);

  return routes;
};

const AppRouter: FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default AppRouter;
