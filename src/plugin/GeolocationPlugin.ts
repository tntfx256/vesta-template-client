import { Storage } from "@vesta/services";
import { ILocation } from "../cmn/interfaces/GeoLocation";

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
 * By default, getCurrentPosition() tries to answer as fast as possible with a low accuracy result.
 * It is useful if you need a quick answer regardless of the accuracy. Devices with a GPS,
 *  for example, can take a minute or more to get a GPS fix,
 * so less accurate data (IP location or wifi) may be returned to getCurrentPosition().
 */
export class GeolocationPlugin {
  public static Event = "location-update";

  public static getCurrentLocation(): Promise<ILocation> {
    return new Promise<ILocation>((resolve, reject) => {
      GeolocationPlugin.getLocation(resolve, reject);
    });
  }

  public static getLatestLocation(): ILocation {
    const defaultLocation = Storage.sync.get<ILocation>("defaultLocation");
    let lastLocation = Storage.sync.get<ILocation>(GeolocationPlugin.LocationKey);
    if (!lastLocation || !lastLocation.lat) {
      lastLocation = defaultLocation;
    }
    return lastLocation;
  }

  public static isLocationAccurate(): boolean {
    return GeolocationPlugin.isAccurate;
  }

  public static isLocationValid(): boolean {
    return GeolocationPlugin.isValid;
  }

  public static preventGettingLocation(prevent: boolean) {
    GeolocationPlugin.preventLocation = prevent;
  }

  private static defaultLocation: ILocation;
  private static isAccurate = false;
  private static isValid = false;
  private static LocationKey = "last-location";
  private static preventLocation = false;
  private static timeout = 10000;
  private static timeoutThreshold = 30000;
  private static tmpPositionOptions: PositionOptions;
  // tslint:disable-next-line:member-ordering
  private static positionOptions: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: GeolocationPlugin.timeout,
  };

  private static getLocation(resolve, reject) {
    const defaultLocation = GeolocationPlugin.getLatestLocation();
    // use default options or tampered options by plugin
    const positionOptions = GeolocationPlugin.tmpPositionOptions || { ...GeolocationPlugin.positionOptions };
    if (GeolocationPlugin.preventLocation) {
      return reject({ message: "geo_prevent" });
    }
    if (!navigator.geolocation) {
      // geolocation is not available
      return reject({ message: "geo_not_supported" });
    }
    navigator.geolocation.getCurrentPosition(
      (position: Position) => {
        // console.log(positionOptions);
        GeolocationPlugin.isValid = true;
        GeolocationPlugin.isAccurate = positionOptions.enableHighAccuracy;
        let location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        if (!location.lat && !location.lng) {
          location = defaultLocation;
          GeolocationPlugin.isValid = false;
        }
        // if (GeolocationPlugin.isValid) {
        // delete tmpPositionOptions to reset settings to default
        // todo: if position is not accurate, try for highAccuracy
        GeolocationPlugin.tmpPositionOptions = null;
        // }
        Storage.sync.set(GeolocationPlugin.LocationKey, location);
        resolve(location);
      },
      (error: PositionError) => {
        // console.error(error, positionOptions);
        if (error.code !== error.TIMEOUT) {
          return reject(error);
        }
        // checking timeoutThreshold
        if (positionOptions.timeout >= GeolocationPlugin.timeoutThreshold) {
          // checking high accuracy
          if (positionOptions.enableHighAccuracy) {
            // disabling high accuracy
            // console.log("removing accuracy");
            positionOptions.enableHighAccuracy = false;
          } else {
            // checking app activity
            if (Storage.sync.get<boolean>("inBackground")) {
              // super extend timeout if app in background
              // console.log("app in bg; extending timeout even more");
              positionOptions.timeout = Math.floor((3 * positionOptions.timeout) / 2);
            } else {
              // some thing is wrong, send error to higher level
              // console.log("real failure");
              GeolocationPlugin.tmpPositionOptions = null;
              return reject(error);
            }
          }
        } else {
          // extending timeout
          // console.log("extending timeout");
          positionOptions.timeout = GeolocationPlugin.timeoutThreshold;
        }
        GeolocationPlugin.tmpPositionOptions = positionOptions;
        return GeolocationPlugin.getLocation(resolve, reject);
      },
      positionOptions
    );
  }
}
