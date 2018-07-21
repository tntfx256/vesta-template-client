/**
 * cordova-plugin-x-toast
 */
export class ToastPlugin {

    public static getInstance() {
        if (!ToastPlugin.instance) {
            ToastPlugin.instance = new ToastPlugin();
        }
        return ToastPlugin.instance;
    }

    private static instance: ToastPlugin;
    private toast: any;

    private constructor() {
        this.toast = window.plugins && (window.plugins as any).toast;
    }

    public show(message: string, duration?: string, position?: string) {
        duration = duration || "short";
        position = position || "bottom";
        this.toast.show(message, duration, position);
    }
}
