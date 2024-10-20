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
}