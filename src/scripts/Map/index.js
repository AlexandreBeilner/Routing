import {route, utils} from "../../Globals";
import {FacDriveFunctions} from "../../FacDriveFunctions";
import {MapLib} from "./MapLib";
import pinImage from 'images/pin.png';
import arrivalImage from 'images/bandeira-branca.png';


export class Map {
    constructor(container) {
        this.container = container;
        this.map = null;
        this.directionsService = null;
        this.routePoints = [];
        this.bestRoutePoints = [];
        this.path = [];
        this.universityPosition = {lat: -27.09390800094124, lng: -52.66638176434375};
        this.startMarker = null;
        this.callback = () => {};
        this.mapLib = new MapLib();
    }

    async init() {
        await this.mapLib.loadMap();
        this.map = this.mapLib.getMap();
        this.directionsService = this.mapLib.getDirectionService();
        this.initMapEvents();
    }


    initMapEvents() {
        this.map.addListener("click", (event) => {
            if (route.createRouteIsActive) {
                this.routePoints.push(event.latLng)
                this.showRoute(this.routePoints, false);
                const distance = this.calculateCoordinatesDistance(this.routePoints);
                FacDriveFunctions.updateDistance('create-routes-menu-distance', distance);
                if (this.routePoints.length === 1) {
                    this.startMarker = this.createOriginMarker(event.latLng);
                }
                this.callback(this.routePoints);
            }
        });
    }

    showRoute(coordinates, setMapCenter = true) {
        this.mapLib.clearPolylines();
        this.mapLib.createPolyline(coordinates);
        setMapCenter && this.mapLib.setMapCenter(coordinates[0]);
    }

    requestLocationPermission() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    utils.userPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    utils.hasGeolocation = true;
                },
                () => {
                    utils.userPosition = {
                        latitude: 0,
                        longitude: 0
                    };
                    utils.hasGeolocation = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        }
    }

    formatCoordinateArrayToGoogleAPI(array) {
        return array.map(item => {
            return {lat: Number(item.latitude), lng: Number(item.longitude)};
        })
    }

    resetDefaultState() {
        this.mapLib.clearMap();
        this.routePoints = [];
        this.bestRoutePoints = [];
        this.createDestinationMarker();
        this.callback(this.routePoints)
    }

    backOnePoint() {
        if (this.routePoints.length > 0) {
            this.routePoints.pop();
            this.showRoute(this.routePoints, false);
            const distance = this.calculateCoordinatesDistance(this.routePoints);
            FacDriveFunctions.updateDistance('create-routes-menu-distance', distance);
            if (this.routePoints.length === 0) {
                this.mapLib.removeMarker(this.startMarker);
            }
            this.callback(this.routePoints);
        }
    }

    async completeRoute() {
        if (this.routePoints.length > 0) {
            const lastPoint = this.routePoints[this.routePoints.length - 1];
            const remainingRoute = await this.setBestRoute({lat: lastPoint.lat(), lng: lastPoint.lng()});
            this.routePoints.push(...remainingRoute);
            this.showRoute(this.routePoints, false);
            const distance = this.calculateCoordinatesDistance(this.routePoints);
            FacDriveFunctions.updateDistance('create-routes-menu-distance', distance);
        }
    }

    setBestRoute(origin) {
        const request = {
            origin: origin,
            destination: this.universityPosition,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: false,
            unitSystem: google.maps.UnitSystem.METRIC,
        };

        return new Promise((resolve, reject) => {
            this.directionsService.route(request, (response, status) => {
                if (status === "OK") {
                    this.bestRoutePoints = response.routes[0].overview_path;
                    resolve(this.bestRoutePoints);
                } else {
                    reject(status);
                }
            });
        });
    }

    formatRoutePoints(routePoints) {
        return routePoints.map(point => ({
            lat: point.lat(),
            lng: point.lng()
        }))
    }

    getRoutePoints() {
        return this.routePoints;
    }

    getBestRoutePoints() {
        return this.bestRoutePoints;
    }

    calculateCoordinatesDistance(coordinates) {
        let totalDistance = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(coordinates[i], coordinates[i + 1]);
            totalDistance += distance;
        }
        return (totalDistance / 1000).toFixed(2)
    }

    setMapCenter(coordinates) {
        this.mapLib.setMapCenter(coordinates)
    }

    clearMap() {
        this.mapLib.clearMap()
    }

    createDestinationMarker(coordinates) {
        this.mapLib.createMarker(coordinates ?? this.universityPosition, 40, arrivalImage);
    }

    createOriginMarker(coordinates) {
        return this.mapLib.createMarker(coordinates, 30, pinImage);
    }

    setCallback(callback) {
        this.callback = callback;
    }
}