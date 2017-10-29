import {LogService} from "../service/LogService";

/**
 * cordova-plugin-splashscreen
 */
export class SplashPlugin {
    private splash: any;

    constructor() {
        //<development>
        if (!window.navigator || !window.navigator.splashscreen) {
            LogService.error('Keyboard is not defined');
        } else
        //</development>
            this.splash = navigator.splashscreen;
    }

    hide() {
        //<development>
        if (!this.check('hide')) return;
        //</development>
        this.splash.hide();
    }

    show() {
        //<development>
        if (!this.check('show')) return;
        //</development>
        this.splash.show();
    }


    //<development>
    private check(method): boolean {
        if ('undefined' == typeof Keyboard) {
            LogService.error(`Keyboard is not defined: ${method}`);
            return false
        }
        return true;
    }

    //</development>
}
