import {ConfigService} from "../service/ConfigService";
import {LogService} from "../service/LogService";
import {ILocation} from "../cmn/models/GeoLocation";
import {StorageService} from "../service/StorageService";
import {NotificationService} from "../service/NotificationService";

export class GeolocationPlugin {
    private static instance: GeolocationPlugin;
    private static LocationKey = 'last-location';
    private defaultLocation: ILocation = ConfigService.get<ILocation>('defaultLocation');
    private defaultDelayToGetLocation = 10000;
    private notif = NotificationService.getInstance();

    private constructor() {
    }

    public getCurrentLocation(): Promise<ILocation> {
        let defaultLocation = StorageService.get<ILocation>(GeolocationPlugin.LocationKey);
        if (!defaultLocation || !defaultLocation.lat) {
            defaultLocation = this.defaultLocation;
        }
        return new Promise<ILocation>((resolve, reject) => {
            if (!navigator.geolocation) {
                LogService.error('Not supported!', 'getCurrentLocation', 'GeolocationPlugin');
                this.notif.warning('warn_enable_gps');
                return resolve(defaultLocation);
            }
            navigator.geolocation.getCurrentPosition((pos) => {
                let location = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                };
                StorageService.set(GeolocationPlugin.LocationKey, location);
                resolve(location);
            }, (e) => {
                LogService.error(e.message, 'getCurrentLocation', 'GeolocationPlugin');
                resolve(defaultLocation);
            }, {
                enableHighAccuracy: false,
                timeout: this.defaultDelayToGetLocation,
                maximumAge: 90000
            });

        });
    }

    public static getInstance(): GeolocationPlugin {
        if (!GeolocationPlugin.instance) {
            GeolocationPlugin.instance = new GeolocationPlugin();
        }
        return GeolocationPlugin.instance;
    }
}