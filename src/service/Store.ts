import { IToastMessageProps } from "@vesta/components";
import { createContext, Dispatch } from "react";
import { IUser } from "../cmn/models/User";
import { getAuth } from "./Auth";

export enum AppAction { User, Navbar }

export interface IAppState {
    navbar: boolean;
    toast: IToastMessageProps;
    user: IUser;
}

export interface IAppAction {
    type: AppAction;
    payload: Partial<IAppState>;
}

export interface IStore {
    state: IAppState;
    dispatch: Dispatch<IAppAction>;
}

export function getInitialState(): IAppState {
    return {
        navbar: false,
        toast: null,
        user: getAuth().getUser(),
    };
}

export function appReducer(state: IAppState, action: IAppAction): IAppState {
    if (!state) {
        return getInitialState();
    }
    switch (action.type) {
        case AppAction.User:
            return { ...state, user: action.payload.user };
        case AppAction.Navbar:
            return { ...state, navbar: action.payload.navbar };
    }
    return state;
}

export const Store = createContext<IStore>({} as IStore);
