/**
 * cordova-plugin-splashscreen
 */
export class SplashPlugin {

    public static show() {
        document.body.classList.add('has-splash');
        //<cordova>
        // we always display our fake splash; so cordova splash must be hidden
        navigator.splashscreen.hide();
        //</cordova>
    }

    public static hide() {
        //<cordova>
        navigator.splashscreen.hide();
        //</cordova>
        document.body.classList.remove('has-splash');
    }
}
