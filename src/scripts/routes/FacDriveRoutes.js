export class FacDriveRoutes {
    static BASE_URL = 'https://routing-app-aucug4gxfchndyas.brazilsouth-01.azurewebsites.net';

    static async getUserConfig(userID) {
        const response = await fetch(this.BASE_URL + `/facdrive/user/get-user-config?iduser=${userID}`);

        return await response.json();
    }

    static async getNearbyRoutes(data) {
        const queryParams = `userID=${data.userID}&latitude=${data.latitude}&longitude=${data.longitude}&distance=${data.distance}`
        const response = await fetch(this.BASE_URL + `/facdrive/router/get-nearby-routes?${queryParams}`);

        return await response.json();
    }

    static async getCompleteRouteByRouteID(routeID) {
        const response = await fetch(this.BASE_URL + `/facdrive/router/get-route-by-routeid?routeID=${routeID}`);

        return await response.json();
    }

    static async getCoordinatesByUserAddress(userID){
        const response = await fetch(this.BASE_URL + `/facdrive/user/get-coordinates-by-user-address?iduser=${userID}`);

        return await response.json();
    }

    static async getUserRoutes(userID){
        const response = await fetch(this.BASE_URL + `/facdrive/router/get-user-routes?iduser=${userID}`);

        return await response.json();
    }

    static async saveRoute(userID, routeName, routePoints) {
        const response = await fetch(this.BASE_URL + `/facdrive/router/save-route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID,
                route: routePoints,
                routeName
            })
        });

        return await response.json();
    }

    static async deleteRoute(routeID) {
        const response = await fetch(this.BASE_URL + `/facdrive/router/delete-route?routeID=${routeID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    }

    static async deleteRelationship(key, value, routeID) {
        const response = await fetch(this.BASE_URL + `/facdrive/user/delete-relationship?${key}=${value}&routeID=${routeID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    }

    static async createRelationship(driverID, riderID, routeID, longitude, latitude) {
        const resp = await fetch(this.BASE_URL + '/facdrive/user/create-relationship', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                driverID,
                riderID,
                routeID,
                longitude,
                latitude
            })
        })

        return await resp.json();
    }

    static async getRouteRiders(driverID, routeID, status = 'any'){
        const resp = await fetch(this.BASE_URL + `/facdrive/router/get-riders-by-route?routeID=${routeID}&driverID=${driverID}&status=${status}`);

        return await resp.json()
    }

    static async getAddressCoordinates(userID) {
        const resp = await fetch(this.BASE_URL + `/facdrive/user/get-coordinates-by-user-address?iduser=${userID}`);

        return await resp.json();
    }

    static async setRunningStatus(data) {
        await fetch(this.BASE_URL + '/facdrive/router/set-running-status', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    static async getRunningStatus(key, value, route) {
        const resp = await fetch(this.BASE_URL + `/facdrive/router/get-running-status?${key}=${value}&routeID=${route}`);
        const respParsed = await resp.json();

        return respParsed.response[0];
    }

    static async getUserRelationships(key, value) {
        const resp = await fetch(this.BASE_URL + `/facdrive/user/get-user-relationships?${key}=${value}`);
        const respParsed = await resp.json();
        return respParsed.response;
    }
}