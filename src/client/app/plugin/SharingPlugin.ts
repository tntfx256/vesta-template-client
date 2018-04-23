/**
 * cordova-plugin-x-socialsharing
 */
export class SharingPlugin {

    public static getInstance(): SharingPlugin {
        if (!SharingPlugin.instance) {
            SharingPlugin.instance = new SharingPlugin();
        }
        return SharingPlugin.instance;
    }

    private static instance: SharingPlugin;
    private socialSharing: any;

    constructor() {
        this.socialSharing = window.plugins && window.plugins.socialsharing;
    }

    public shareImage(message: string, subject: string, image: string, link?: string) {
        this.socialSharing.share(message, subject, image, link);
    }

    public shareMessage(message: string, subject: string) {
        this.socialSharing.share(message, subject);
    }
}
