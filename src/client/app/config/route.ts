import {ComponentClass} from "react";
import {IPermissionCollection} from "../service/AuthService";
import {Login} from "../components/root/Login";
import {Home} from "../components/root/Home";
import {Logout} from "../components/root/Logout";
import {About} from "../components/root/About";
import {TranslateService} from "../service/TranslateService";
import {Forget} from "../components/root/Forget";
import {Profile} from "../components/root/Profile";

export interface RouteItem {
    link: string;
    title: string;
    exact?: boolean;
    abstract?: boolean;
    children?: Array<RouteItem>;
    component?: ComponentClass<any>;
    permissions?: IPermissionCollection;
}

export function getRoutes(isLoggedIn: boolean): Array<RouteItem> {
    const tr = TranslateService.getInstance().translate;
    return isLoggedIn ? [
        {link: '', title: tr('home'), component: Home, exact: true},
        {link: 'about', title: tr('about'), component: About},
        {link: 'profile', title: tr('profile'), component: Profile, permissions: {user: ['read']}},
        {link: 'logout', title: tr('logout'), component: Logout, permissions: {account: ['logout']}}
    ] : [
        {link: '', title: tr('home'), component: Home, exact: true},
        {link: 'about', title: tr('about'), component: About},
        {link: 'forget', title: tr('forget_pass'), component: Forget, permissions: {account: ['forget']}},
        {link: 'login', title: tr('login'), component: Login, permissions: {account: ['login']}},
    ]
}