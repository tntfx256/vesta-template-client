import { Auth, Storage } from "@vesta/services";
import { IUser } from "../cmn/models/User";

let instance: Auth<IUser> = null;

export const AuthEvents = { Update: "auth-update" };

export function getAuth(): Auth<IUser> {

    if (!instance) {
        instance = new Auth<IUser>({ storage: Storage });
    }
    return instance;
}

export function isGuest() {
    const user = getAuth().getUser();
    return !user || !user.id;
}
