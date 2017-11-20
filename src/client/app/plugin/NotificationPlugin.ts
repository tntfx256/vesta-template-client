import {StorageService} from "../service/StorageService";
import {IUser} from "../cmn/models/User";
import {ApiService} from "../service/ApiService";
import {ConfigService} from "../service/ConfigService";
import {LogService} from "../service/LogService";

export interface PushNotifData {
    id: string;
    content: string;
    heading: string;
    icon: string;
    data: any;
}

export interface PushNotifCallBack {
    (data: any): void;
}

export class NotificationPlugin {
    private static instance: NotificationPlugin;
    private api = ApiService.getInstance();
    private OneSignal: any;
    private cbs: Array<PushNotifCallBack> = [];

    private constructor() {
        //<!cordova>
        this.OneSignal = window['OneSignal'] || [];
        this.OneSignal.push(["init", {
            appId: ConfigService.get('onesignal-id'),
            autoRegister: true,
            notifyButton: {
                enable: false
            },
            notificationClickHandlerMatch: 'origin',
            notificationClickHandlerAction: 'focus',
        }]);
        this.OneSignal.push(['addListenerForNotificationOpened', this.callRegisterers]);
        //</cordova>

        //<cordova>
        // window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        // console.log("User accepted notifications: " + accepted);
        // });
        // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
        window.plugins['OneSignal']
            .startInit(ConfigService.get('onesignal-id'), "10152591676")
            .handleNotificationOpened(this.callCordovaRegisteres)
            .endInit();
        //</cordova>

    }

    public updateNotifToken(user: IUser) {
        const token = StorageService.get<string>('push-token');
        if (user.id) {
            let promise;
            //<!cordova>
            promise = this.getWebToken()
            //</cordova>
            //<cordova>
            promise = this.getDeviceToken();
            //</cordova>

            promise.then(newToken => {
                StorageService.set('push-token', newToken);
                if (!newToken) return;
                if (token && token != newToken) {
                    return this.api.put('token', {prevToken: token, token: newToken})
                        .catch(error => LogService.error(error.message));
                }
                return this.api.post('token', {token: newToken})
                    .catch(error => LogService.error(error.message));
            })
        } else if (token) {
            return this.api.del(`token`, token)
                .catch(error => LogService.error(error.message));
        }
    }

    public register(cb: PushNotifCallBack) {
        if (this.cbs.indexOf(cb) < 0) {
            this.cbs.push(cb);
        }
    }

    public unregister(cb: PushNotifCallBack) {
        let index = this.cbs.indexOf(cb);
        if (index >= 0) {
            this.cbs.splice(index, 1);
        }
    }

    //<!cordova>
    public getWebToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.OneSignal.push(() => {
                this.OneSignal.getUserId()
                    .then(token => resolve(token))
                    .catch(error => reject(error));
            });
        })

    }

    private callRegisterers = (data: any) => {
        let payload = data.data;
        for (let i = 0, il = this.cbs.length; i < il; ++i) {
            this.cbs[i](payload);
        }
        this.OneSignal.push(['addListenerForNotificationOpened', this.callRegisterers]);
    }
    //</cordova>

    //<cordova>
    private callCordovaRegisteres = (data) => {
        let payload = data.notification.payload.additionalData;
        for (let i = 0, il = this.cbs.length; i < il; ++i) {
            this.cbs[i](payload);
        }
    }

    public getDeviceToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            window.plugins['OneSignal'].getPermissionSubscriptionState((status) => {
                resolve(status.subscriptionStatus.userId);
            });
        })
    }

    //</cordova>

    public logoutToken(): Promise<string> {
        const token = StorageService.get<string>('push-token');
        StorageService.remove('push-token');
        return new Promise<string>((resolve) => {
            token && this.api.del(`token`, token)
                .then(() => resolve())
                .catch(err => console.log(err));
        })
    }

    public static getInstance(): NotificationPlugin {
        if (!NotificationPlugin.instance) {
            NotificationPlugin.instance = new NotificationPlugin();
        }
        return NotificationPlugin.instance;
    }
}
