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
import {ManageLocalStorage} from "./scripts/service/ManageLocalStorage";
const container = document.getElementById('map-container');

export class Main {
    async init() {
        components.alert = new Alert(container);
        const params = new URLSearchParams(window.location.search);
        const userID = params.get('userID');
        facdriveSocket = new WebSocketClient(userID ?? 2);
        //todo: remover o id padrão 81
        const userConfig = await FacDriveRoutes.getUserConfig(userID ?? 2);
        this.setUserConfig(userConfig.response[0]);

        components.input.createSearchBox(container);
        utils.map = new Map(container);
        await utils.map.init();

        const routeID = ManageLocalStorage.manage('get', 'routeID');
        menus.bottomSheetSelectedRoute = new BottomSheetSelectedRoute(container, routeID);
        menus.createRoutesMenu = new CreateRoutesMenu(container);
        menus.bottomSheetMenu = new BottomSheetMenu(container);

        if (routeID) {
            const resp = await FacDriveRoutes.getCompleteRouteByRouteID(routeID);
            menus.bottomSheetSelectedRoute.init({route: resp.response, backEvent: menus.bottomSheetMenu.init.bind(menus.bottomSheetMenu)})
        } else {
            menus.bottomSheetMenu.init();
        }

        utils.map.requestLocationPermission();
    }

    setUserConfig(options) {
        Object.keys(options).map(key => {
            userConfig[key] = options[key];
        });
    }
}

new Main().init().then(() => {
    console.log("ROUTING APPLICATION STARTED");
})