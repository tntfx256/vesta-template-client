export type BackButtonHandler = (e: any) => void;

export class DevicePlugin {

    public static getInstance(): DevicePlugin {
        if (!DevicePlugin.instance) {
            DevicePlugin.instance = new DevicePlugin();
        }
        return DevicePlugin.instance;
    }

    private static instance: DevicePlugin;
    private handlers: BackButtonHandler[] = [];

    private constructor() {
        document.addEventListener("backbutton", this.onBackButton, false);

    }

    public registerBackButtonHandler(handler: BackButtonHandler) {
        this.handlers.push(handler);
    }

    public unregisterBackButtonHandler(handler: BackButtonHandler) {
        for (let i = this.handlers.length; i--;) {
            if (this.handlers[i] == handler) {
                this.handlers.splice(i, 1);
                break;
            }
        }
    }

    private onBackButton = (e) => {
        // calling the last registered handler
        const handler = this.handlers.length && this.handlers[this.handlers.length - 1];
        if (!handler) { return; }
        handler(e);
    }
}
