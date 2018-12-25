import { IUser } from "../cmn/models/User";
import { IMessage } from "./AppState";

export enum AppAction { User = 1, Toast, Navbar }

export interface IAppAction {
    type: AppAction;
    payload: IUser | IMessage;
}
