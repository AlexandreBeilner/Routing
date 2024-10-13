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
        console.log(userID, routeName, routePoints)
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
}