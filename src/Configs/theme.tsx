import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: "#12B0EE",
      dark: "#12B0EE",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#BEBEBE",
      dark: "#BEBEBE",
      contrastText: "#ffffff",
    },
    error: {
      main: "#AD0000",
    },
    success: {
      main: "#47C055",
    },
    warning: {
      main: "#FF881A",
    },
    text: {
      primary: "#24272C",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    button: {
      textTransform: "capitalize",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
        },

        "*::-webkit-scrollbar": {
          height: "8px",
          width: "8px",
        },

        "*::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },

        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "rgb(158, 158, 158)",
        },

        html: {
          scrollBehavior: "smooth",
        },

        body: {
          fontFamily: 'Roboto,"sans-serif"',
        },

        "#root": {
          overflowX: "hidden",
        },

        button: {
          alignItems: "center",
          border: "none",
          display: "flex",
          fontFamily: "Roboto",
          fontSize: "16px",
          fontWeight: "bold",
          justifyContent: "space-between",
          outline: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderWidth: 2,

          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export default theme;
