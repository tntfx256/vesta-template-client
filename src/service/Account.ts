import { Acl, IAccess, IPermissions } from "@vesta/services";
import jwt from "jwt-decode";
import { IRole } from "../cmn/models/Role";
import { IUser } from "../cmn/models/User";

export type Account = {
  login(token: string): void;
  logout(): void;
  getUser(): IUser;
  getToken(): string | null;
  isGuest(): boolean;
  hasAccess(permissions: IPermissions): boolean;
  getAccessList(resource: string, ...actions: string[]): IAccess;
};

let accountInstance: Account = null;

export const AuthEvents = { Update: "auth-update" };

export function getAccountInstance(): Account {
  if (!accountInstance) {
    // const authInstance = new Auth<IUser>({ storage: Storage });
    const aclInstance = new Acl();
    let authUser: IUser | null = {};
    // init auth user
    const storedToken = localStorage.getItem("auth-token");
    if (storedToken) {
      try {
        const { user } = jwt(storedToken);
        authUser = user;
      } catch {
        //
      }
    }
    // account instance
    accountInstance = {
      login(token: string) {
        try {
          const { user } = jwt(token);
          authUser = user;
          aclInstance.setRole(user.role as IRole);
          localStorage.setItem("auth-token", token);
        } catch {
          //
        }
      },
      logout() {
        authUser = {};
        aclInstance.setRole(null);
        localStorage.removeItem("auth-token");
      },
      getUser(): IUser {
        return authUser;
      },
      getToken(): string | null {
        return localStorage.getItem("auth-token");
      },
      isGuest(): boolean {
        const user = accountInstance.getUser();
        return !user || !user.id;
      },
      getAccessList(resource: string, ...actions: string[]): IAccess {
        return aclInstance.getAccessList(resource, ...actions);
      },
      hasAccess(permissions: IPermissions): boolean {
        return aclInstance.hasAccess(permissions);
      },
    };
  }
  return accountInstance;
}
