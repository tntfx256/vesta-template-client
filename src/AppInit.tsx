import React, { useReducer } from "react";
import { App } from "./App";
import "./ltr.scss";
import { appReducer, getInitialState, Store } from "./service/Store";

export default () => {
  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, getInitialState());

  return (
    <Store.Provider value={{ state, dispatch }}>
      <App />
    </Store.Provider>
  );
};
