import { Log } from "../service/Log";

/** cordova-open-native-settings */
export class OpenSettingPlugin {

    public static open(section?: string) {
        ((window as any).cordova.plugins as any).settings.open(section, null, () => {
            Log.error("Error on opening device setting", "open", "OpenSettingPlugin");
        });
    }
}
