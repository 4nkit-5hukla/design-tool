import { Fragment } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

// ! Components Imports
import AppRouter from "Routes/AppRouter";
import theme from "Configs/theme";
import GoogleFont from "Components/Utils/GoogleFont";

const App = () => {
  const appFont = {
    font: "Roboto",
    weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  };

  return (
    <Fragment>
      <GoogleFont fonts={[appFont]} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRouter />
      </ThemeProvider>
    </Fragment>
  );
};

export default App;
