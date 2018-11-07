import { ILocation } from "../cmn/interfaces/GeoLocation";
import { isCordova } from "../util/Platform";
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
        NavigatorPlugin.launchNavigator(dest, sourceLocation);
    }

    private static launchNavigator(destination: ILocation, source?: ILocation) {
        if (isCordova()) {
            let options = null;
            if (source) {
                options = { start: [source.lat, source.lng] };
            }
            (window as any).launchnavigator.navigate([destination.lat, destination.lng], options);
        } else {
            const baseUrl = "https://www.google.com/maps/dir/?api=1&";
            const sourceQuery = source ? `origin=${source.lat},${source.lng}&` : "";
            const link = `${baseUrl}${sourceQuery}destination=${destination.lat},${destination.lng}&travelmode=driving`;
            launchLink(link);
        }
    }
}
