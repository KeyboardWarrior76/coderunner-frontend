import React from "react";
import { ThemeProvider } from "emotion-theming";
import theme from "@styles/theme";


const Providers = ({ children }) => (
  <ThemeProvider theme={theme} >
    { children }
  </ThemeProvider>
)


export default Providers;
