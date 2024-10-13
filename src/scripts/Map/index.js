import { Loader } from "@googlemaps/js-api-loader"
import {route, utils} from "../../Globals";

export class Map {
    constructor(container) {
        this.container = container;
        this.map = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        this.polylines = [];
        this.markers = [];
        this.waypoints = [];
        this.path = [];
        this.universityPosition = {lat: -27.09390800094124, lng: -52.66638176434375}
    }

    async init() {
        await this.loadMap();
        this.initMapEvents();
    }

    async loadMap() {
        const loader = new Loader({
            apiKey: "AIzaSyCplFtJUTMPVqb_Pi39bW5dgkvxNTV31cw",
            version: "weekly",
        });

        try {
            const { Map, places  } = await loader.importLibrary("maps");

            this.map = new Map(document.getElementById("map"), {
                center: { lat: -27.093898594238937, lng: -52.6664602479717 },
                zoom: 20,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                scaleControl: false,
                rotateControl: false,
                fullscreenControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_LEFT
                },
            });

            this.directionsService = new google.maps.DirectionsService();
            this.directionsRenderer = new google.maps.DirectionsRenderer();
            this.directionsRenderer.setMap(this.map);

            await this.createSearchBox(loader);
        } catch (error) {
            console.error("Erro ao carregar a biblioteca Google Maps:", error);
        }

    }

    initMapEvents() {
        this.map.addListener("click", (event) => {
            if (route.createRouteIsActive) {
                console.log('aaaaaaaaaaaaa')
            }

        });
    }

    async createSearchBox(loader) {
        const { SearchBox } = await loader.importLibrary("places");
        const input = document.getElementById("pac-input");
        const searchBox = new SearchBox(input);

        this.map.addListener("bounds_changed", () => {
            searchBox.setBounds(this.map.getBounds());
        });

        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

            if (places.length === 0) {
                return;
            }

            const place = places[0];

            if (!place.geometry || !place.geometry.location) {
                return;
            }

            if (place.geometry.viewport) {
                this.map.fitBounds(place.geometry.viewport);
            } else {
                this.map.setCenter(place.geometry.location);
                this.map.setZoom(10);
            }
        });
    }

    createPolyline(coordiantes) {
        const backgroundPolyline = new google.maps.Polyline({
            path: coordiantes,
            strokeColor: '#0083a1',
            strokeOpacity: 1.0,
            strokeWeight: 9,
        });

        const polyline = new google.maps.Polyline({
            path: coordiantes,
            strokeColor: '#ffffff',
            strokeOpacity: 1.0,
            strokeWeight: 5,
        });

        backgroundPolyline.setMap(this.map);
        polyline.setMap(this.map);
        this.polylines.push(backgroundPolyline, polyline);
    }

    createMarker(coordinate, markerImage) {
        const marker = new google.maps.Marker({
            position: coordinate,
            map: this.map,
            icon: {
                url: `data:image/png;base64,${markerImage}`,
                scaledSize: new google.maps.Size(50, 50),
                anchor: new google.maps.Point(25, 50)
            },
        });

    }

    showRoute(coordinates) {
        this.clearMap();
        this.createPolyline(coordinates);
        this.setMapCenter(coordinates[0]);
    }

    calculateCoordinatesDistance(coordinates) {
        let totalDistance = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
            const distance = google.maps.geometry.spherical.computeDistanceBetween(coordinates[i], coordinates[i + 1]);
            totalDistance += distance;
        }
        return (totalDistance / 1000).toFixed(2)
    }


    requestLocationPermission() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    utils.userPosition = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                    utils.hasGeolocation = true;
                },
                () => {
                    utils.userPosition = {
                        latitude: 0,
                        longitude: 0
                    }
                    utils.hasGeolocation = false;
                }
            );
        }
    }

    formatCoordinateArrayToPolyline(array) {
        return array.map(item => {
            return {lat: Number(item.latitude), lng: Number(item.longitude)};
        })
    }

    setMapCenter(coordinates) {
        this.map.setCenter(coordinates);
        this.map.setZoom(16);
    }

    clearMap() {
        this.polylines.map(item => {
            item.setMap(null)
        })
    }

    getBestRoute(origin) {
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
                    this.routePoints = response.routes[0].overview_path;
                    this.distance = this.calculateCoordinatesDistance(this.routePoints);
                    this.showRoute(this.routePoints);
                    resolve(this.distance);
                } else {
                    reject(status);
                }
            });
        });
    }

    getRoutePoints() {
        return this.routePoints.map(point => ({
            lat: point.lat(),
            lng: point.lng()
        }));
    }

    getDistance() {
        return this.distance;
    }
}
