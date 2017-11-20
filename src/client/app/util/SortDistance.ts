export class SortDistance {
    private static instance;

    private constructor() {}

    public sortByDistance(items, userLocation) {
        if(items) {
            for (let i = 0; i < items.length; i++) {
                let distance = this.getDistanceFromCoordinates(userLocation.lat, userLocation.lng, items[i].lat, items[i].lng);
                items[i]['distance'] = distance;
            }
            items.sort((a, b) => {
                return a.distance - b.distance;
            });
        }
        return items || [];
    }

    public deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    public getDistanceFromCoordinates(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    public static getInstance(): SortDistance {
        if(!SortDistance.instance) {
            SortDistance.instance = new SortDistance();
        }
        return SortDistance.instance;
    }
}