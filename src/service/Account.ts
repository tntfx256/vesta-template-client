import { Acl, IAccess, IPermissions, IRole } from "@vesta/services";
import { IUser } from "../cmn/models/User";

export const AuthEvents = { Update: "auth-update" };

export function getAccountInstance(): Account {
  return Account.getInstance();
}

export class Account {
  private static instance: Account;
  public static getInstance() {
    if (!Account.instance) {
      Account.instance = new Account();
    }
    return Account.instance;
  }

  private aclInstance = new Acl();
  private authUser: IUser = {};

  constructor() {
    // init auth user
    const storedUser = localStorage.getItem("auth-user");
    try {
      this.authUser = JSON.parse(storedUser);
    } catch{
      //
    }
  }

  login(user: IUser, token?: string) {
    this.authUser = user;
    this.aclInstance.setRole(user.role as IRole);
    localStorage.setItem("auth-user", JSON.stringify(user));
    // if only token is set, update it. e.g update user info from profile page
    if (token) {
      localStorage.setItem("auth-token", token);
    }
  }
  logout() {
    this.authUser = {};
    this.aclInstance.setRole(null);
    localStorage.removeItem("auth-token");
    localStorage.removeItem("auth-user");
  }
  getUser(): IUser {
    return this.authUser;
  }
  getToken(): string | null {
    return localStorage.getItem("auth-token");
  }
  isGuest(): boolean {
    const user = this.getUser();
    return !user || !user.id;
  }
  getAccessList(resource: string, ...actions: string[]): IAccess {
    return this.aclInstance.getAccessList(resource, ...actions);
  }
  hasAccess(permissions: IPermissions): boolean {
    return this.aclInstance.hasAccess(permissions);
  }
}