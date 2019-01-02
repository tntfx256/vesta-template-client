import { IResponse } from "@vesta/core";
import { Auth, Storage } from "@vesta/services";
import { IUser } from "../cmn/models/User";
import { AppAction } from "../misc/AppAction";
import { appStore } from "../misc/appStore";
import { getApi } from "./Api";

let instance: Auth<IUser> = null;

export const AuthEvents = { Update: "auth-update" };

export function getAuth(): Auth<IUser> {

    if (!instance) {
        instance = new Auth<IUser>({ storage: Storage, hooks: { afterInit } });
    }
    return instance;

    function afterInit() {
        getApi().get<IUser, IResponse<IUser>>("me")
            .then((response) => {
                const user = response.items[0];
                instance.login(user);
                appStore.dispatch({ type: AppAction.User, payload: user });
            });
    }
}

export function isGuest() {
    const user = getAuth().getUser();
    return !user || !user.id;
}
