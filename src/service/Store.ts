import { IToastMessageProps } from "@vesta/components";
import { createContext, Dispatch } from "react";
import { IUser } from "../cmn/models/User";
import { getAuthInstance } from "./Auth";

export interface IAppState {
    navbar: boolean;
    toast: IToastMessageProps;
    user: IUser;
}

export interface IStore {
    store: IAppState;
    dispatch: Dispatch<Partial<IAppState>>;
}

export function getInitialState(): IAppState {
    return {
        navbar: false,
        toast: null,
        user: getAuthInstance().getUser(),
    };
}

export function appReducer(state: IAppState, action: IAppState): IAppState {
    return { ...state, ...action };
}

export const Store = createContext<IStore>(null);
