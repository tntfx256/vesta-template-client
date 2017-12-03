import {GeolocationPlugin} from "./GeolocationPlugin";
import {ConfigService} from "../service/ConfigService";
import {launchLink} from "../util/Util";
import {ILocation} from "../util/Geo";

/**
 * uk.co.workingedge.phonegap.plugin.launchnavigator
 */
export class NavigatorPlugin {

    public static navigate(dest: ILocation, useSourceIfPossible?: boolean) {
        let sourceLocation = null;
        if (useSourceIfPossible) {
            sourceLocation = GeolocationPlugin.isLocationValid() ? GeolocationPlugin.getLatestLocation() : null;
        }
        //<cordova>
        NavigatorPlugin.launchCordovaNavigator(dest, sourceLocation);
        //</cordova>
        //<!cordova>
        NavigatorPlugin.launchNavigator(dest, sourceLocation);
        //</cordova>
    }

    //<!cordova>
    private static launchNavigator(destination: ILocation, source?: ILocation) {
        let baseUrl = ConfigService.get('google-navigator-url');
        let sourceQuery = source ? `origin=${source.lat},${source.lng}&` : '';
        let link = `${baseUrl}${sourceQuery}destination=${destination.lat},${destination.lng}&travelmode=driving`;
        launchLink(link);
    }

    //</cordova>

    //<cordova>
    private static launchCordovaNavigator(destination: ILocation, source?: ILocation) {
        let options = null;
        if (source) {
            options = {start: [source.lat, source.lng]}
        }
        launchnavigator.navigate([destination.lat, destination.lng], options);
    }

    //</cordova>
}