import { setTheme } from "@vesta/components";
import { createTheme } from "@vesta/theme";
import React, { useReducer } from "react";
import { ThemeProvider } from "react-jss";
import { App } from "./App";
import { appReducer, getInitialState, Store } from "./service/Store";

export default () => {
  const theme = createTheme({});
  setTheme(theme);

  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, getInitialState());

  return (
    <ThemeProvider theme={theme}>
      <Store.Provider value={{ state, dispatch }}>
        <App />
      </Store.Provider>
    </ThemeProvider>
  );
};
