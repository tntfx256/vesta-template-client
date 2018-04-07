import { IToken } from "../cmn/models/Token";
import { IUser } from "../cmn/models/User";
import { ApiService } from "../service/ApiService";
import { Config } from "../service/Config";
import { LogService } from "../service/LogService";
import { StorageService } from "../service/StorageService";

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
    private api = ApiService.getInstance();
    private cbs: PushNotifCallBack[] = [];
    private OneSignal: any;
    private tokenKeyName = "push-token";

    private constructor() {
        //<!cordova>
        this.OneSignal = (window as any).OneSignal || [];
        this.OneSignal.push(["init", {
            allowLocalhostAsSecureOrigin: true,
            appId: Config.get("onesignal-id"),
            autoRegister: true,
            notificationClickHandlerAction: "focus",
            notificationClickHandlerMatch: "origin",
            notifyButton: { enable: false },
        }]);
        this.OneSignal.push(["addListenerForNotificationOpened", this.callRegisterers]);
        //</cordova>

        //<cordova>
        (window.plugins as any).OneSignal
            .startInit(Config.get("onesignal-id"))
            .inFocusDisplaying((window.plugins as any).OneSignal.OSInFocusDisplayOption.None)
            // when app is in focus and new notification arrives
            .handleNotificationReceived(this.callCordovaRegisteres)
            // when app is in background and new notification arrives
            .handleNotificationOpened(this.callCordovaRegisteres)
            .endInit();
        //</cordova>
    }

    public deleteToken(): Promise<string> {
        const token = StorageService.get<string>(this.tokenKeyName);
        StorageService.remove(this.tokenKeyName);
        return new Promise<string>((resolve) => {
            if (!token) { return resolve(); }
            this.api.del(`token/${token}`)
                .then(() => resolve())
                .catch((error) => LogService.error(error, "deleteToken", "NotificationPlugin"));
        });
    }

    public updateNotifToken(user: IUser): Promise<any> {
        const token = StorageService.get<string>(this.tokenKeyName);
        if (!user.id) {
            // removing token on user logout
            if (token) {
                StorageService.remove(this.tokenKeyName);
                return this.api.del(`token/${token}`);
            }
            return Promise.resolve();
        }
        // updating user token
        let getTokenPromise;
        //<!cordova>
        getTokenPromise = this.getWebToken();
        //</cordova>
        //<cordova>
        getTokenPromise = this.getDeviceToken();
        //</cordova>
        return getTokenPromise.then((newToken) => {
            StorageService.set(this.tokenKeyName, newToken);
            if (!newToken) { return; }
            // updating token
            if (token && token != newToken) {
                return this.api.put<IToken>("token", { prevToken: token, token: newToken });
            }
            // adding new token
            return this.api.post<IToken>("token", { token: newToken });
        });
    }

    public register(cb: PushNotifCallBack) {
        if (this.cbs.indexOf(cb) < 0) {
            this.cbs.push(cb);
        }
    }

    public unregister(cb: PushNotifCallBack) {
        const index = this.cbs.indexOf(cb);
        if (index >= 0) {
            this.cbs.splice(index, 1);
        }
    }

    //<!cordova>
    private getWebToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.OneSignal.push(() => {
                this.OneSignal.getUserId()
                    .then((token) => resolve(token))
                    .catch((error) => reject(error));
            });
        });
    }

    private callRegisterers = (data: any) => {
        const payload = data.data;
        for (let i = 0, il = this.cbs.length; i < il; ++i) {
            this.cbs[i](payload);
        }
        this.OneSignal.push(["addListenerForNotificationOpened", this.callRegisterers]);
    }
    //</cordova>

    //<cordova>
    private getDeviceToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            (window.plugins as any).OneSignal.getPermissionSubscriptionState((status) => {
                resolve(status.subscriptionStatus.userId);
            });
        });
    }

    private callCordovaRegisteres = (data) => {
        // if app is in focus => data.payload.additionalData
        // if app is in background and user clicks on notification => data.notification.payload.additionalData
        let fromBackground = false;
        let payload = {};
        if (data.notification) {
            fromBackground = true;
            payload = data.notification.payload.additionalData;
        } else {
            payload = data.payload.additionalData;
        }
        for (let i = 0, il = this.cbs.length; i < il; ++i) {
            this.cbs[i](payload, fromBackground);
        }
    }
    //</cordova>
}
