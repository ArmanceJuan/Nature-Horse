import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#F28705",
    },
    background: {
      default: "#F2F2F2",
      paper: "#F2F2F2",
    },
    text: {
      primary: "#262626",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Libre Caslon Text', serif" },
    h2: { fontFamily: "'Libre Caslon Text', serif" },
    h3: { fontFamily: "'Libre Caslon Text', serif" },
    h4: { fontFamily: "'Libre Caslon Text', serif" },
  },
});
