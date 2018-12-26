import { MessageType } from "@vesta/components";
import { IUser } from "../cmn/models/User";
import { getAuth } from "../service/Auth";

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
        user: getAuth().getUser(),
        toast: null,
    }
}