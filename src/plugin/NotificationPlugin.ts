export interface IPushNotifData {
    content: string;
    data: any;
    heading: string;
    icon: string;
    id: string;
}

export type PushNotifCallBack = (data: any, fromBackground?: boolean) => void;

export class NotificationPlugin {

    public static getInstance(): NotificationPlugin {
        if (!NotificationPlugin.instance) {
            NotificationPlugin.instance = new NotificationPlugin();
        }
        return NotificationPlugin.instance;
    }

    private static instance: NotificationPlugin;

    private constructor() {
    }
}
