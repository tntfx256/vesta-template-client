import {AbstractClient} from "./AbstractClient";

export class CordovaApp extends AbstractClient{

    public init() {
        if (cordova.plugins && cordova.plugins['Keyboard']) {
            cordova.plugins['Keyboard'].hideKeyboardAccessoryBar(true);
            cordova.plugins['Keyboard'].disableScroll(true);
        }
        let statusBar: StatusBar = window['StatusBar'];
        if (statusBar) {
            statusBar.styleDefault();
        }
    }

}