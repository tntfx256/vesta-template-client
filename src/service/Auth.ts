import { IResponse } from "@vesta/core";
import { Auth, Storage } from "@vesta/services";
import { IUser, User } from "../cmn/models/User";
import { getAclInstance } from "./Acl";
import { getApiInstance } from "./Api";

let instance: Auth<IUser> = null;

export const AuthEvents = { Update: "auth-update" };

export function getAuthInstance(): Auth<IUser> {
    if (!instance) {
        instance = new Auth<IUser>({ storage: Storage });
        afterInit(instance.getUser());
    }
    return instance;

    function afterInit(user: IUser) {
        if (user) {
            getAclInstance().addRole(instance.getUser().role as any);
        }
        getApiInstance()
            .get<IUser, IResponse<IUser>>("me")
            .then(response => {
                const user = response ? response.items[0] : new User().getValues<IUser>();
                instance.login(user);
                getAclInstance().addRole(user.role as any);
                // appStore.dispatch({ type: AppAction.User, payload: { user } });
            })
            .catch((e: Error) => {
                //
            });
    }
}

export function isGuest() {
    const user = getAuthInstance().getUser();
    return !user || !user.id;
}
