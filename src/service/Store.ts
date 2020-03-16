import { IToastMessageProps } from "@vesta/components";
import { createContext, Dispatch, useContext } from "react";
import { IUser } from "../cmn/models/User";
import { getAccountInstance } from "./Account";

export interface IAppState {
  navbar: boolean;
  toast: IToastMessageProps | null;
  user: IUser;
}

export interface IStore {
  state: IAppState;
  dispatch: Dispatch<Partial<IAppState>>;
}

export function getInitialState(): IAppState {
  return {
    navbar: false,
    toast: null,
    user: getAccountInstance().getUser(),
  };
}

export function appReducer(state: IAppState, action: Partial<IAppState>): IAppState {
  return { ...state, ...action };
}

const Store = createContext<IStore>(null);

export const useStore = (): IStore => useContext<IStore>(Store);

export const StoreProvider = Store.Provider;
