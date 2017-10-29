import {LogService} from "../service/LogService";

/**
 * cordova-plugin-statusbar
 */
export class StatusbarPlugin {
    private statusbar: StatusBar;

    constructor() {
        //<development>
        if (!window.StatusBar) {
            LogService.error('Statusbar is not defined');
        } else
        //</development>
            this.statusbar = StatusBar;
    }

    styleDefault() {
        //<development>
        if (!this.check('styleDefault')) return;
        //</development>
        this.statusbar.styleDefault();
    }

    //<development>
    private check(method): boolean {
        if (!window.StatusBar) {
            LogService.error(`Statusbar is not defined: ${method}`);
            return false
        }
        return true;
    }

    //</development>
}