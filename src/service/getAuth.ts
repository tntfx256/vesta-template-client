import { Auth, Storage } from "@vesta/services";
import { IUser } from "../cmn/models/User";
import { getApi } from "./getApi";
import { IResponse, Dispatcher } from "@vesta/core";

let instance: Auth<IUser> = null;

export function getAuth(): Auth<IUser> {
    const Events = { Update: "auth-update" };

    if (!instance) {
        instance = new Auth<IUser>({ storage: Storage, hooks: { afterInit } });
    }
    return instance;

    function afterInit() {
        getApi().get<IUser, IResponse<IUser>>("me")
            .then((response) => {
                const user = response.items[0];
                instance.login(user);
                Dispatcher.getInstance().dispatch(Events.Update, user);
            });
    }
}