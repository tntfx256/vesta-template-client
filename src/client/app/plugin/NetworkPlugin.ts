/**
 * cordova-plugin-network-information
 */

export class NetworkPlugin {

    constructor() {
        //<cordova>

        //</cordova>
        //<web>

        //</web>
    }

    public getConnectionType(): string {
        let type = '';
        //<cordova>
        type = navigator.connection && navigator.connection.type;
        //</cordova>
        //<web>
        type = navigator.onLine ? Connection.WIFI : Connection.NONE;
        //</web>
        return type;
    }

    public isOnline(): boolean {
        let isOnline = true;
        //<web>
        isOnline = navigator.onLine;
        //</web>
        //<cordova>
        const connType = this.getConnectionType();
        isOnline = connType != Connection.UNKNOWN && connType != Connection.NONE;
        //</cordova>
        return isOnline;
    }

}
