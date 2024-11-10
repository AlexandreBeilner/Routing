import "./scripts/service/Websocket";
import './initMap';
import { Map } from "./scripts/Map";
import {components, facdriveSocket, menus, userConfig, utils} from "./Globals";
import {BottomSheetMenu} from "./scripts/menus/BottomSheetMenu";
import {CreateRoutesMenu} from "./scripts/menus/CreateRoutesMenu";
import {FacDriveRoutes} from "./scripts/routes/FacDriveRoutes";
import {Alert} from "./scripts/Components/Alert";
import {FacDriveFunctions} from "./FacDriveFunctions";
import {BottomSheetSelectedRoute} from "./scripts/menus/BottomSheetSelectedRoute";
import {WebSocketClient} from "./scripts/service/Websocket";
const container = document.getElementById('map-container');

export class Main {
    async init() {
        components.alert = new Alert(container);
        const params = new URLSearchParams(window.location.search);
        const userID = params.get('userID');
        facdriveSocket = new WebSocketClient(userID);
        const userConfigResp = await FacDriveRoutes.getUserConfig(userID);
        this.setUserConfig(userConfigResp.response[0]);

        components.input.createSearchBox(container);
        utils.map = new Map(container);
        await utils.map.init();

        await this.setUserCoordinates()

        menus.bottomSheetSelectedRoute = new BottomSheetSelectedRoute(container);
        menus.createRoutesMenu = new CreateRoutesMenu(container);
        menus.bottomSheetMenu = new BottomSheetMenu(container);

        menus.bottomSheetMenu.init();


        await FacDriveFunctions.startRideScreen(container);
    }

    setUserConfig(options) {
        Object.keys(options).map(key => {
            userConfig[key] = options[key];
        });
    }

    async setUserCoordinates() {
        const resp = await FacDriveRoutes.getAddressCoordinates(userConfig.iduser);
        if (resp.response) {
            utils.userPosition = resp.response;
        } else {
            const resp = await utils.map.requestLocationPermission()
            if (resp) {
                utils.userPosition = resp;
            } else {
                utils.userPosition = {
                    latitude: 0,
                    longitude: 0
                };
            }
        }
    }
}

new Main().init().then(() => {
    console.log("ROUTING APPLICATION STARTED");
})