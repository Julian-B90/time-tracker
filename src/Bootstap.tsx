import { ThemeProvider } from "@emotion/react";
import { createTheme, colors, CssBaseline } from "@mui/material";
import App from "./App";
import { SnachbarProvider } from "./context/SnackbarContext";

const theme = createTheme({
  palette: {
    background: {
      default: colors.grey[200],
    },
  },
});

function Bootstap() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnachbarProvider>
        <App />
      </SnachbarProvider>
    </ThemeProvider>
  );
}

export default Bootstap;
