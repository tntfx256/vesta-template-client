import {ConfigService} from "../service/ConfigService";
import {StorageService} from "../service/StorageService";
import {ILocation} from "../util/Geo";

export class GeolocationPlugin {
    private static LocationKey = 'last-location';
    private defaultLocation: ILocation;
    private static timeout = 5000;
    private static isValid = false;
    private static preventLocation = false;

    public static getCurrentLocation(): Promise<ILocation> {
        let defaultLocation = GeolocationPlugin.getLatestLocation();
        return new Promise<ILocation>((resolve, reject) => {
            if (GeolocationPlugin.preventLocation) {
                return reject({message: 'geo_prevent'});
            }
            if (!navigator.geolocation) {
                // geolocation is not available
                return reject({message: 'geo_not_supported'});
            }
            navigator.geolocation.getCurrentPosition((pos) => {
                GeolocationPlugin.isValid = true;
                let location = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                if (!location.lat && !location.lng) {
                    location = defaultLocation;
                    GeolocationPlugin.isValid = false;
                }
                StorageService.set(GeolocationPlugin.LocationKey, location);
                resolve(location);
            }, reject, {
                enableHighAccuracy: true,
                timeout: GeolocationPlugin.timeout,
                maximumAge: GeolocationPlugin.timeout
            });

        });
    }

    public static isLocationValid(): boolean {
        return GeolocationPlugin.isValid;
    }

    public static preventGettingLocation(prevent: boolean) {
        GeolocationPlugin.preventLocation = prevent;
    }

    public static getLatestLocation(): ILocation {
        const defaultLocation = ConfigService.get<ILocation>('defaultLocation');
        let lastLocation = StorageService.get<ILocation>(GeolocationPlugin.LocationKey);
        if (!lastLocation || !lastLocation.lat) {
            lastLocation = defaultLocation;
        }
        return lastLocation;
    }
}