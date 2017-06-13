import {Dispatcher} from "./Dispatcher";

export const enum MessageType{Info = 1, Success, Warning, Error}

export interface IToastData {
    message: string;
    type: MessageType;
}

export class NotificationService {

    static instance: NotificationService;

    constructor(private dispacher: Dispatcher) {
    }

    public success(message: string) {
        this.toast(message, MessageType.Success);
    }

    public error(message: string) {
        this.toast(message, MessageType.Error);
    }

    public warning(message: string) {
        this.toast(message, MessageType.Warning);
    }

    public toast(message: string, type: MessageType = MessageType.Info) {
        this.dispacher.dispatch<IToastData>('toast', {message, type});
    }

    public static getInstance(dispatcher: Dispatcher = Dispatcher.getInstance('main')): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService(dispatcher);
        }
        return NotificationService.instance;
    }
}