import {ComponentClass} from "react";
import {IPermissionCollection} from "../service/AuthService";
import {TranslateService} from "../service/TranslateService";
import {Login} from "../components/root/Login";
import {Home} from "../components/root/Home";
import {Logout} from "../components/root/Logout";
import {Forget} from "../components/root/Forget";
import {Profile} from "../components/root/Profile";
import {Register} from "../components/root/Register";
import {Contact} from "../components/root/Contact";
import {About} from "../components/root/About";

export interface RouteItem {
    link: string;
    title: string;
    exact?: boolean;
    abstract?: boolean;
    children?: Array<RouteItem>;
    component?: ComponentClass<any>;
    permissions?: IPermissionCollection;
    // show/hide in menu list
    hidden?: boolean;
}

export function getRoutes(isLoggedIn: boolean): Array<RouteItem> {
    const tr = TranslateService.getInstance().translate;
    return isLoggedIn ? [
        {link: '', title: tr('home'), component: Home, exact: true},
        {link: 'about', title: tr('about'), component: About},
        {link: 'contact', title: tr('contact_us'), component: Contact},
        {link: 'profile', title: tr('profile'), component: Profile, permissions: {user: ['read']}},
        {link: 'logout', title: tr('logout'), component: Logout, permissions: {account: ['logout']}},
    ] : [
        {link: '', title: tr('home'), component: Home, exact: true},
        {link: 'about', title: tr('about'), component: About},
        {link: 'forget', title: tr('forget_pass'), component: Forget, permissions: {account: ['forget']}},
        {link: 'login', title: tr('login'), component: Login, permissions: {account: ['login']}},
        {link: 'register', title: tr('register'), component: Register, permissions: {account: ['register']}},
    ];
}