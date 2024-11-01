import {userConfig, utils} from "./Globals";
import {FacDriveRoutes} from "./scripts/routes/FacDriveRoutes";

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

    static manegeRouteInLocalStorage(action, routeID) {
        if (action === 'save') {
            localStorage.setItem('routeID', `${routeID}`);
            return;
        }
        if (action === 'get') {
            return localStorage.getItem('routeID');
        }
        localStorage.removeItem('routeID');
    }
}