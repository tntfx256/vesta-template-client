/**
 * cordova-plugin-splashscreen
 */
export class SplashPlugin {

    public static show() {
        document.body.classList.add('has-splash');
    }

    public static hide() {
        //<cordova>
        navigator.splashscreen.hide();
        //</cordova>
        document.body.classList.remove('has-splash');
    }
}
