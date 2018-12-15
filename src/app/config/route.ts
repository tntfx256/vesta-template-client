import { Culture } from "@vesta/core";
import { FC } from "react";
import { Forget } from "../components/root/Forget";
import { Home } from "../components/root/Home";
import { Login } from "../components/root/Login";
import { Logout } from "../components/root/Logout";
import { Profile } from "../components/root/Profile";
import { Register } from "../components/root/Register";
import { IPermissionCollection } from "../service/AuthService";

export interface IRouteItem {
    abstract?: boolean;
    children?: IRouteItem[];
    component?: FC<any>;
    exact?: boolean;
    // show/hide this item in menu list
    hidden?: boolean;
    // show icon on menu
    icon?: string;
    link: string;
    permissions?: IPermissionCollection;
    title: string;
}

export function getRoutes(isLoggedIn: boolean): IRouteItem[] {
    const tr = Culture.getDictionary().translate;

    return isLoggedIn ? [
        { link: "", title: tr("home"), component: Home, exact: true },
        { link: "profile", title: tr("profile"), component: Profile },
        { link: "logout", title: tr("logout"), component: Logout },
    ] : [
            { link: "", title: tr("login"), component: Login, exact: true },
            { link: "forget", title: tr("forget_pass"), component: Forget, hidden: true },
            { link: "register", title: tr("register"), component: Register },
        ];
}
