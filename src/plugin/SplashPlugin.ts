import { isCordova } from "@vesta/core/Platform";

/**
 * cordova-plugin-splashscreen
 */
export class SplashPlugin {

    public static show() {
        document.body.classList.add("has-splash");
    }

    public static hide() {
        if (isCordova()) {
            (navigator as any).splashscreen.hide();
        }
        document.body.classList.remove("has-splash");
    }
}
