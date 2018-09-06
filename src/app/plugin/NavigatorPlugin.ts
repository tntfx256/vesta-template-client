import { ILocation } from "../cmn/interfaces/GeoLocation";
import { launchLink } from "../util/Util";
import { GeolocationPlugin } from "./GeolocationPlugin";

/**
 * uk.co.workingedge.phonegap.plugin.launchnavigator
 */
export class NavigatorPlugin {

    public static navigate(dest: ILocation, useSourceIfPossible?: boolean) {
        let sourceLocation = null;
        if (useSourceIfPossible) {
            sourceLocation = GeolocationPlugin.isLocationValid() ? GeolocationPlugin.getLatestLocation() : null;
        }
        /// <cordova>
        NavigatorPlugin.launchCordovaNavigator(dest, sourceLocation);
        /// </cordova>
        /// <!cordova>
        NavigatorPlugin.launchNavigator(dest, sourceLocation);
        /// </cordova>
    }

    /// <cordova>
    private static launchCordovaNavigator(destination: ILocation, source?: ILocation) {
        let options = null;
        if (source) {
            options = { start: [source.lat, source.lng] };
        }
        (window as any).launchnavigator.navigate([destination.lat, destination.lng], options);
    }
    /// </cordova>

    /// <!cordova>
    private static launchNavigator(destination: ILocation, source?: ILocation) {
        const baseUrl = "https://www.google.com/maps/dir/?api=1&";
        const sourceQuery = source ? `origin=${source.lat},${source.lng}&` : "";
        const link = `${baseUrl}${sourceQuery}destination=${destination.lat},${destination.lng}&travelmode=driving`;
        launchLink(link);
    }
    /// </cordova>
}
