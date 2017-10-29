import {ILocation} from "../components/general/GoogleMap";
import {ConfigService} from "../service/ConfigService";
import {LogService} from "../service/LogService";

export class GeolocationPlugin {
    private defaultLocation: ILocation = ConfigService.get<ILocation>('defaultLocation');

    public getCurrentLocation(): Promise<ILocation> {
        return new Promise<ILocation>((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    resolve({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                }, (e) => {
                    LogService.error(e.message);
                    resolve(this.defaultLocation);
                })
            } else {
                LogService.error('Not supported!');
                resolve(this.defaultLocation);
            }
        });
    }
}