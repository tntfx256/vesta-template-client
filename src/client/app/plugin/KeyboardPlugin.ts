import {LogService} from "../service/LogService";

/**
 * cordova-plugin-keyboard
 */
export class KeyboardPlugin {
    private kb: Keyboard

    constructor() {
        //<development>
        if ('undefined' == typeof Keyboard) {
            LogService.error('KeyboardPlugin is not available');
        } else
        //</development>
            this.kb = Keyboard;
    }

    public setDefaultProperties() {
        //<development>
        if (!this.check('setDefaultProperties')) return;
        //</development>
        this.kb.hideFormAccessoryBar(true);
        this.kb.disableScrollingInShrinkView(true);
        this.kb.shrinkView(true);
    }

    public isVisible(): boolean {
        //<development>
        if (!this.check('isVisible')) return false;
        //</development>
        return this.kb.isVisible;
    }

    //<development>
    private check(method): boolean {
        if ('undefined' == typeof Keyboard) {
            LogService.error(`KeyboardPlugin: ${method}`);
            return false
        }
        return true;
    }

    //</development>
}