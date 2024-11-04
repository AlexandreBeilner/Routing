import {userConfig, utils} from "../../Globals";
import {FacDriveFunctions} from "../../FacDriveFunctions";
import destinationImage from '../../assets/images/bandeira-branca.png';
import riderImage from '../../assets/images/riderPin.png';
import startImage from '../../assets/images/pin.png';

export class RunningScreen {
    constructor(container, riders = [], route) {
        this.container = container;
        this.riders = riders;
        this.route = route;
        this.routePoints = utils.map.formatCoordinateArrayToGoogleAPI(route.routePoints);
    }

    init() {
        utils.map.clearMap();
        FacDriveFunctions.togglePrincipalMenuVisibility('hide');
        this.createHeaderScreen()
        this.createBottomScreen();
    }

    createHeaderScreen() {
        const header = document.createElement('div');
        header.setAttribute('class', 'running-screen-header');

        document.getElementById('pac-input').classList.add('down');

        const status = document.createElement('span');
        status.innerText = 'Status: '

        header.append(status);
        this.container.append(header)
    }

    createBottomScreen() {
        const bottom = document.createElement('div');
        bottom.setAttribute('class', 'running-screen-bottom');

        const route = document.createElement('div');
        route.setAttribute('class', 'running-screen-route');

        const startMarker = document.createElement('div');
        startMarker.setAttribute('class', 'marker-image start-marker');
        startMarker.style.backgroundImage = `url(${startImage})`;

        const destinationMarker = document.createElement('div');
        destinationMarker.setAttribute('class', 'marker-image destination-marker');
        destinationMarker.style.backgroundImage = `url(${destinationImage})`;

        const distance = utils.map.calculateCoordinatesDistance(this.routePoints);
        const totalDistance = document.createElement('span');
        totalDistance.innerText = `Distância: ${distance}km`;

        route.appendChild(startMarker);
        route.appendChild(destinationMarker);

        bottom.append(totalDistance, route);
        this.container.append(bottom);

        if (this.riders.length > 0) {
            const ridersDistance = this.calculateRidesDistance();
            ridersDistance.forEach(item => {
                const container = document.createElement('div');
                container.setAttribute('class', 'marker-image-container')
                const elementDistance = document.createElement('span');
                const elementName = document.createElement('span');

                elementDistance.innerText = item.distance + 'km';
                elementName.innerText = item.name;

                const riderMarker = document.createElement('div');
                riderMarker.setAttribute('class', 'rider-marker');
                riderMarker.style.backgroundImage = `url(${riderImage})`;

                const routeDistancePX = route.offsetWidth;
                const riderPosition = (item.distance * routeDistancePX) / distance;

                container.append(elementDistance, riderMarker, elementName);

                container.style.left = `${riderPosition}px`;
                route.appendChild(container);
            })
        }
    }

    calculateRidesDistance() {
        const ridersDistance = [];
        this.riders.forEach(item => {
            const coordinates = [];
            for (const routePoint of this.routePoints) {
                coordinates.push(routePoint);
                if (Number(routePoint.lat) === Number(item.latitude) && Number(routePoint.lng) === Number(item.longitude)) {
                    break;
                }
            }
            ridersDistance.push({
                name: item.ridername + ' ' + item.ridersurname,
                distance: utils.map.calculateCoordinatesDistance(coordinates)
            })
        })
        return ridersDistance;
    }
}