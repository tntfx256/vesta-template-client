import { createStore, Store } from "redux";
import { IUser } from "../cmn/models/User";
import { AppAction, IAppAction } from "./AppAction";
import { getInitialState as getAppInitialState, IAppState } from "./AppState";

export const appStore: Store<IAppState, IAppAction> = createStore(appReducer);

function appReducer(state: IAppState, action: IAppAction): IAppState {
    if (!state) {
        return getAppInitialState();
    }

    switch (action.type) {
        case AppAction.User:
            state = { ...state, user: { ...(action.payload as IUser) } };
            break;
    }

    return state;
}