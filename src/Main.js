import { Map } from "./scripts/Map";
import {components, menus, userConfig, utils} from "./Globals";
import {BottomSheetMenu} from "./scripts/menus/BottomSheetMenu";
import {CreateRoutesMenu} from "./scripts/menus/CreateRoutesMenu";
import {FacDriveRoutes} from "./scripts/routes/FacDriveRoutes";
import {Alert} from "./scripts/Components/Alert";
const container = document.getElementById('map-container');

export class Main {
    async init() {
        components.alert = new Alert(container);
        const params = new URLSearchParams(window.location.search);
        const userID = params.get('userID');
        //todo: remover o id padrão 81
        const userConfig = await FacDriveRoutes.getUserConfig(userID ?? 81);
        this.setUserConfig(userConfig.response[0]);

        utils.map = new Map(container);
        await utils.map.init();

        components.input.createSearchBox(container);

        menus.createRoutesMenu = new CreateRoutesMenu(container);
        menus.bottomSheetMenu = new BottomSheetMenu(container);
        menus.bottomSheetMenu.init();


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