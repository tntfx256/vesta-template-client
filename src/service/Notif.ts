import { Dispatcher } from "@vesta/core";
import { Culture } from "@vesta/culture";
import { MessageType } from "../cmn/enum/MessageType";

export interface IToastData {
    message: string;
    type: MessageType;
}

export class Notif {
    public static getInstance(dispatch = Dispatcher.getInstance()): Notif {
        if (!Notif.instance) {
            Notif.instance = new Notif(dispatch);
        }
        return Notif.instance;
    }

    private static instance: Notif;
    private tr = Culture.getDictionary().translate;

    private constructor(private dispatch) {}

    public success(message: string, ...placeholders: any[]) {
        this.toast(message, MessageType.Success, placeholders);
    }

    public error(message: string, ...placeholders: any[]) {
        this.toast(message, MessageType.Error, placeholders);
    }

    public warning(message: string, ...placeholders: any[]) {
        this.toast(message, MessageType.Warning, placeholders);
    }

    public toast(message: string, type: MessageType = MessageType.Info, ...placeholders: any[]) {
        const text = this.tr(message, placeholders);
        // this.dispatch({ type: AppAction.Toast, payload: { toast: { message: text, type } } });
        // tslint:disable-next-line:no-console
        console.log(text);
    }
}
