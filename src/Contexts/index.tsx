import { ContextsProps } from "Interfaces";

import AppState from "./AppState";
import History from "./History";
import Elements from "./Elements";

const Contexts = ({ children }: ContextsProps) => {
  return (
    <AppState>
      <History>
        <Elements>{children}</Elements>
      </History>
    </AppState>
  );
};

export default Contexts;
