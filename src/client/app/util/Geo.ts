/**
 * Created by masood on 11/11/17.
 */
export class Geo {
    private static instance: Geo;
    // fixed variable for measuring distance instead of calculating the radius
    private constant = Math.PI / 173;
    private latCoef = 365 / Math.PI;
    private lngCoef = 180 / Math.PI;

    private constructor() {
    }

    public getNearCoordinates(distance: number, userLocation) {
        const earthRadius = 6371.01;
        const distanceInKilometers = distance * 0.6;
        const latRadian = (distanceInKilometers / earthRadius) * this.latCoef;
        const lngRadian = (distanceInKilometers / earthRadius) * this.lngCoef;
        // north east coordinate
        let neLat = userLocation.lat + latRadian;
        let neLng = userLocation.lng + lngRadian / Math.cos(userLocation.lat * this.constant);
        // south west coordinate
        let swLat = userLocation.lat - latRadian;
        let swLng = userLocation.lng - lngRadian / Math.cos(userLocation.lat * this.constant);

        return {neLat, neLng, swLat, swLng};
    }

    public static getInstance(): Geo {
        if (!Geo.instance) {
            Geo.instance = new Geo();
        }
        return Geo.instance;
    }
}