import {userConfig, utils} from "./Globals";
import {FacDriveRoutes} from "./scripts/routes/FacDriveRoutes";
import {RunningScreen} from "./scripts/Screens/RunningScreen";

export class FacDriveFunctions {
    static async getUserCoordinates() {
        let coordinates = {lat: utils.userPosition.latitude, lng: utils.userPosition.longitude};
        if (! (utils.userPosition.longitude && utils.userPosition.latitude)) {
            const request = await FacDriveRoutes.getCoordinatesByUserAddress(userConfig.iduser);
            coordinates = {lat: request.response.latitude ?? 0, lng: request.response.longitude ?? 0};
        }

        return coordinates;
    }

    static updateDistance(elementID, distance) {
        const element = document.getElementById(elementID);
        element.innerHTML = distance + " KM";
    }

    static togglePrincipalMenuVisibility(visibility) {
        if (visibility === 'show') {
            const circleButton = document.getElementById('circle-button');
            circleButton.classList.add('up-button');
            circleButton.classList.remove('hide');
            document.getElementById('bottom-sheet-menu')?.classList.add('expanded');
            return;
        }
        const circleButton = document.getElementById('circle-button');
        circleButton.classList.remove('up-button');
        circleButton.classList.add('hide');
        document.getElementById('bottom-sheet-menu')?.classList.remove('expanded');
    }

    static compareObjectArrays(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return {
                areEqual: false,
                differences: arr1.concat(arr2).filter(item => !arr1.some(obj => JSON.stringify(obj) === JSON.stringify(item)) || !arr2.some(obj => JSON.stringify(obj) === JSON.stringify(item)))
            };
        }

        const differences = [];
        for (let i = 0; i < arr1.length; i++) {
            if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
                differences.push({ arr1: arr1[i], arr2: arr2[i] });
            }
        }

        return {
            areEqual: differences.length === 0,
            differences: differences
        };
    }

    static async startRideScreen(container) {
        const relationships = await FacDriveRoutes.getUserRelationships(userConfig.isdriver ? 'driverID' : 'riderID', userConfig.iduser);
        for (let i = 0; i < relationships.length; i++) {
            if (relationships[i].isrunning) {
                const route = await FacDriveRoutes.getCompleteRouteByRouteID(relationships[i].idroute);
                const riders = await FacDriveRoutes.getRouteRiders(relationships[i].driverid, relationships[i].idroute, 'true');
                (new RunningScreen(container, riders.response, route.response)).init();
                return;
            }
        }
    }

    static async getUserPosition() {
        let userPosition = await utils.map.requestLocationPermission();
        if (!userPosition) {
            userPosition = {
                latitude: utils.userPosition.latitude,
                longitude: utils.userPosition.longitude
            }
        }
        return userPosition;
    }
}