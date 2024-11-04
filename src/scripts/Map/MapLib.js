import {Loader} from "@googlemaps/js-api-loader";

export class MapLib {

    constructor() {
        this.map = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        this.polylines = [];
        this.markers = [];
    }
    async loadMap() {
        const loader = new Loader({
            apiKey: process.env.GOOGLE_API_KEY,
            version: "weekly",
        });

        try {
            const { Map, places  } = await loader.importLibrary("maps");

            this.map = new Map(document.getElementById("map"), {
                center: { lat: -27.093898594238937, lng: -52.6664602479717 },
                zoom: 20,
                minZoom: 5,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                scaleControl: false,
                rotateControl: false,
                fullscreenControl: false,
                clickableIcons: false,
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

    createMarker(coordinate, size, markerImage, label) {
        const marker = new google.maps.Marker({
            position: coordinate,
            map: this.map,
            icon: {
                url: markerImage,
                scaledSize: new google.maps.Size(size, size),
                anchor: new google.maps.Point(size/2, size)
            },
            label: {
                text: label,
                color: "#000000",
                fontSize: "12px",
                fontWeight: "bold",
                className: 'markers-label-class'
            }
        });
        this.markers.push(marker);
        return marker;
    }

    getMap() {
        return this.map;
    }

    getDirectionService() {
        return this.directionsService;
    }


    setMapCenter(coordinates) {
        this.map.setCenter(coordinates);
        this.map.setZoom(16);
    }

    clearMap() {
        this.clearPolylines();
        this.clearMarkers()
    }

    clearPolylines() {
        this.polylines.map(polyline => {
            polyline.setMap(null)
        })
    }

    clearMarkers() {
        this.markers.map(marker => {
            marker.setMap(null)
        })
    }

    removeMarker(marker) {
        marker.setMap(null)
    }
}