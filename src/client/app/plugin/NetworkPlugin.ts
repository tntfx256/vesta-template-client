/**
 * cordova-plugin-network-information
 */

export class NetworkPlugin {

    public static getConnectionType(): string {
        let type = '';
        //<cordova>
        type = navigator.connection && navigator.connection.type;
        //</cordova>
        //<web>
        type = navigator.onLine ? Connection.WIFI : Connection.NONE;
        //</web>
        return type;
    }

    public static isOnline(): boolean {
        let isOnline = true;
        //<web>
        isOnline = navigator.onLine;
        //</web>
        //<cordova>
        const connType = NetworkPlugin.getConnectionType();
        isOnline = connType != Connection.UNKNOWN && connType != Connection.NONE;
        //</cordova>
        return isOnline;
    }

}
