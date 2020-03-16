import React, { useReducer } from "react";
import { App } from "./App";
import "./ltr.scss";
import { appReducer, getInitialState, StoreProvider } from "./service/Store";

export default () => {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, getInitialState());

  return (
    <StoreProvider value={{ state, dispatch }}>
      <App />
    </StoreProvider>
  );
};
