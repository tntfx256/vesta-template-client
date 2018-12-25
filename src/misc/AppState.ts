import { MessageType } from "@vesta/components";
import { IUser } from "../cmn/models/User";
import { AuthService } from "../service/AuthService";

export interface IMessage {
    message: string;
    type: MessageType;
}

export interface IAppState {
    user: IUser;
    toast: IMessage;
}

export function getInitialState(): IAppState {
    return {
        user: AuthService.getInstance().getUser(),
        toast: null,
    }
}