import { LogService } from "../service/LogService";

/** cordova-open-native-settings */
export class OpenSettingPlugin {

    public static open(section?: string) {
        (window.cordova.plugins as any).settings.open(section, null, () => {
            LogService.error("Error on opening device setting", "open", "OpenSettingPlugin");
        });
    }
}
