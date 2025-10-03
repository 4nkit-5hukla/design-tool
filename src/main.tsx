import { createRoot } from "react-dom/client";

import Contexts from "Contexts";

import App from "./App";

createRoot(document.getElementById("root")!).render(
  <Contexts>
    <App />
  </Contexts>
);
