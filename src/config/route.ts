import { Culture } from "@vesta/culture";
import { IPermissions } from "@vesta/services";
import { ComponentType } from "react";
import { Forget } from "../components/root/Forget";
import { Home } from "../components/root/Home";
import { Login } from "../components/root/Login";
import { Logout } from "../components/root/Logout";
import { Profile } from "../components/root/Profile";
import { Register } from "../components/root/Register";
import { Role } from "../components/root/Role";
import { User } from "../components/root/User";

export interface IRouteItem {
  abstract?: boolean;
  children?: IRouteItem[];
  component?: ComponentType;
  exact?: boolean;
  // show/hide this item in menu list
  hidden?: boolean;
  // show icon on menu
  icon?: string;
  link: string;
  permissions?: IPermissions;
  title: string;
}

export function getRoutes(isLoggedIn: boolean): IRouteItem[] {
  const tr = Culture.getDictionary().translate;
  const userRoutes = [
    { link: "", title: tr("home"), component: Home, exact: true },
    { link: "profile", title: tr("profile"), component: Profile },
    { link: "user", title: tr("user"), component: User },
    { link: "role", title: tr("role"), component: Role },
    { link: "logout", title: tr("logout"), component: Logout },
  ];
  const guestRoutes = [
    { link: "", title: tr("login"), component: Login, exact: true },
    { link: "forget", title: tr("forget_pass"), component: Forget, hidden: true },
    { link: "register", title: tr("register"), component: Register },
  ];

  return isLoggedIn ? userRoutes : guestRoutes;
}
