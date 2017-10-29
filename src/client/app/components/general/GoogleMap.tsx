import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {Script} from "./Script";
import {ConfigService} from "../../service/ConfigService";

declare const plugin: any;

declare class Map extends google.maps.Map {
    on: (event: string, cb: () => void) => void;
    one: (event: string, cb: () => void) => void;
    getCameraPosition: () => any;
}

export interface ILocation {
    id?: number;
    lng: number;
    lat: number;
}

//<!cordova>
export function launchNavigator(destination: ILocation) {
    let baseUrl = ConfigService.get('google-navigator-url');
    return `${baseUrl}destination=${destination.lat},${destination.lng}&travelmode=driving`;
}

//</cordova>

//<cordova>
export function launchCordovaNavigator(destination: ILocation) {
    launchnavigator.navigate([destination.lat, destination.lng]);
}

//</cordova>

export interface GoogleMapParams {
}

export interface GoogleMapProps extends PageComponentProps<GoogleMapParams> {
    center: ILocation;
    markers?: Array<ILocation>;
    onMarkerClick?: Function;
    onLocationUpdate?: Function;
}

export interface GoogleMapState extends PageComponentState {
}

export class GoogleMap extends PageComponent<GoogleMapProps, GoogleMapState> {
    private static isGoogleMapScriptRequested;
    private static isGoogleMapScriptLoaded;
    private mapWrapper: HTMLDivElement;
    private map: Map;
    private isMarkersAddedOnScreen: boolean = false;
    private markers = [];
    private mapTimer;

    constructor(props: GoogleMapProps) {
        super(props);
        this.state = {currentCenter: null};
    }


    public handleDraggableMarker = () => {
        clearTimeout(this.mapTimer);
        this.mapTimer = setTimeout(() => {
            if (this.map) {
                let center;
                let currentLocation: ILocation;
                //<!cordova>
                center = this.map.getCenter();
                currentLocation = {
                    lat: +center.lat(),
                    lng: +center.lng()
                }
                //</cordova>

                //<cordova>
                center = this.map.getCameraPosition().target;
                currentLocation = {
                    lat: +center.lat,
                    lng: +center.lng
                }
                //</cordova>

                this.props.onLocationUpdate(currentLocation);
            }
        }, 1000);
    }


    public componentDidMount() {
        //<!cordova>
        if (this.mapWrapper && !this.map && GoogleMap.isGoogleMapScriptLoaded && this.props.center) {
            this.loadMap();
        }
        //</cordova>

        //<cordova>
        if (this.mapWrapper && !this.map && this.props.center) {
            this.loadNativeMap();
        }
        //</cordova>
    }

    public componentDidUpdate() {
        const {center, markers} = this.props;

        //<!cordova>
        if (this.mapWrapper && !this.map && GoogleMap.isGoogleMapScriptLoaded && center) {
            this.loadMap();
        }

        if (this.map && !this.isMarkersAddedOnScreen && markers) {
            this.addLocationsOnMap();
        }
        //</cordova>

        //<cordova>
        if (this.map && !this.isMarkersAddedOnScreen && markers) {
            this.addLocationsOnNativeMap();
        }
        //</cordova>

    }


    //<cordova>
    public loadNativeMap = () => {
        const {MAP_READY, MAP_DRAG_END} = plugin.google.maps.event;
        let options = {
            camera: {
                target: {
                    lat: this.props.center.lat,
                    lng: this.props.center.lng
                },
                zoom: 15
            }
        };
        this.map = plugin.google.maps.Map.getMap(this.mapWrapper, options);
        this.map.one(MAP_READY, () => {
            if (this.props.onLocationUpdate) {
                this.handleDraggableMarker();
                this.map.on(MAP_DRAG_END, this.handleDraggableMarker);
            }
            this.forceUpdate();
        });
    }

    public addLocationsOnNativeMap = () => {
        this.props.markers.forEach((location) => {
            this.addNativeMarker(this.map, location);
        })
        this.isMarkersAddedOnScreen = true;
    }

    public addNativeMarker = (map: any, markerLocation: ILocation) => {
        let normalIcon = {
            url: "img/icons/marker.png",
            size: {
                width: 50,
                height: 50
            }
        };
        let promptIcon = {
            url: "img/icons/clickedMarker.png",
            size: {
                width: 60,
                height: 60
            }
        }

        map.addMarker({
            position: markerLocation,
            icon: normalIcon
        }, (marker) => {
            if (this.props.onMarkerClick) {
                marker.on(plugin.google.maps.event.MARKER_CLICK, () => {
                    this.markers.forEach((marker) => {
                        marker.setIcon(normalIcon);
                    })
                    marker.setIcon(promptIcon);

                    this.props.onMarkerClick(markerLocation.id);
                });
            }

            this.markers.push(marker);
        })
    }
    //</cordova>

    //<!cordova>
    public loadMap = () => {
        const {center, onLocationUpdate} = this.props;
        this.map = new google.maps.Map(this.mapWrapper, {center, zoom: 16}) as Map;
        if (onLocationUpdate) {
            this.handleDraggableMarker();
            this.map.addListener('dragend', this.handleDraggableMarker);
        }
        this.forceUpdate();
    }

    public addLocationsOnMap = () => {
        this.props.markers.forEach((location) => {
            this.addMarker(this.map, location);
        })
        this.isMarkersAddedOnScreen = true;
    }

    public onMapScriptLoaded = () => {
        GoogleMap.isGoogleMapScriptLoaded = true;
        this.forceUpdate();
    }

    private loadMapScript() {
        GoogleMap.isGoogleMapScriptRequested = true;
        const key = ConfigService.get('gmap-api-key');
        return (
            <Script src={`https://maps.googleapis.com/maps/api/js?key=${key}`} success={this.onMapScriptLoaded}/>
        )
    }

    private addMarker = (map: any, mechanicShopLocation: ILocation) => {
        let marker = new google.maps.Marker({
            position: {
                lat: mechanicShopLocation.lat,
                lng: mechanicShopLocation.lng
            },
            icon: {
                url: 'img/icons/marker.png',
                scaledSize: {
                    height: 65,
                    width: 50
                }
            } as google.maps.Icon,
            map: map
        });
        this.markers.push(marker);
        if (this.props.onMarkerClick) {
            marker.addListener('click', () => {
                this.markers.forEach((marker) => {
                    marker.setIcon({
                        url: 'img/icons/marker.png',
                        scaledSize: {
                            height: 65,
                            width: 50
                        }
                    });
                })
                marker.setIcon({
                    url: 'img/icons/clickedMarker.png',
                    scaledSize: {
                        height: 65,
                        width: 50
                    }
                } as google.maps.Icon);
                this.props.onMarkerClick(mechanicShopLocation.id);
            })
        }
    }

    //</cordova>

    public render() {
        let marker = null;
        if (this.map && this.props.onLocationUpdate) {
            marker = <span className="marker"></span>;
        }
        //<!cordova>
        if (!GoogleMap.isGoogleMapScriptRequested) {
            return this.loadMapScript();
        }
        //</cordova>

        return (
            <div className="google-map">
                <div className="map-wrapper" ref={el => this.mapWrapper = el}></div>
                <div id="mapMarker">{marker}</div>
            </div>
        )
    }
}
