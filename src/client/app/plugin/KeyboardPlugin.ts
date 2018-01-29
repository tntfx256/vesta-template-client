declare const Keyboard: any;

/**
 * cordova-plugin-ionic-keyboard
 */
export class KeyboardPlugin {

    public static setDefaultProperties() {
        window.addEventListener("keyboardDidShow", (ev: any) => {
            document.body.classList.add("shrink-view");
            // ev.keyboardHeight
        });
        window.addEventListener("keyboardDidHide", () => {
            document.body.classList.remove("shrink-view");
        });
        //<android>
        if (Keyboard.hideKeyboardAccessoryBar) {
            Keyboard.hideKeyboardAccessoryBar();
        }
        //</android>
    }
}