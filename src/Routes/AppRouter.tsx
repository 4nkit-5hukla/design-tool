import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "Pages/Home";
import Preview from "Pages/Preview";
import NotFound404 from "Pages/404";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/preview" element={<Preview />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
