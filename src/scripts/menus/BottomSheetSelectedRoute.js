import {components, facdriveSocket, userConfig, utils} from "../../Globals";
import {FacDriveFunctions} from "../../FacDriveFunctions";
import {FacDriveRoutes} from "../routes/FacDriveRoutes";
import {StartRideModal} from "../Modals/StartRideModal";
import {RunningScreen} from "../Screens/RunningScreen";
import {ManageLocalStorage} from "../service/ManageLocalStorage";

export class BottomSheetSelectedRoute {
    constructor(container, routeID) {
        this.container = container;
        this.selectedRouteID = null;
        this.distance = null;
        this.routeName = null;
        this.initRide = this.initRide.bind(this);
    }
    init(options) {
        this.drawRoute(options.route);

        const container = document.createElement('div');
        container.setAttribute('class', 'bottom-sheet-selected-route');
        const label = document.createElement('span');
        label.setAttribute('class', 'selected-route-name')
        label.innerText = this.routeName;

        this.selectedRouteID = options.route.idroute;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.setAttribute('class', 'buttons-container-selected-route');

        const startButton = this.createStartRouteButton(options.route);
        const backButton = this.createBackButton(container, options.backEvent);

        buttonsContainer.append(startButton, backButton);

        container.append(label, buttonsContainer);
        this.container.appendChild(container);
    }

    exit() {
        document.querySelector('.bottom-sheet-selected-route')?.remove();
    }

    createBackButton(container, event) {
        return components.button.createCircleButtonWithLabel({
            buttonClass: '',
            buttonId: 'back-to-select-route-button',
            icon: 'fa-solid fa-arrow-left',
            label: 'Voltar',
            event: () => {
                container.remove();
                event();
                utils.map.clearMap();
            }
        })
    }

    createStartRouteButton(route) {
        const routeID = route.idroute;
        const driverID = route.iduser;
        const buttonOptions = {
            icon: 'fa-solid fa-play',
            class: 'large-button height-50 blue start-button',
            label: 'Iniciar',
            event: async () => {
                const resp = await FacDriveRoutes.getRouteRiders(driverID, routeID, 'any');
                if (resp.response && resp.response.length > 0) {
                   (new StartRideModal()).init(this.container, resp.response, () => {
                       facdriveSocket.rideManager({
                           routeID, driverID,
                           message: {
                               type: 'startRide',
                               text: 'SUA CARONA SAIU!',
                               title: `O(A) motorista ${userConfig.name} ${userConfig.surname} sairá para a corrida em alguns instantes, fique pronto no local mais próximo a você. Uma boa viagem!`,
                           },
                           data: resp.response
                       })
                       this.initRide(route, resp.response)
                       FacDriveRoutes.setRunningStatus({driverID: route.iduser, routeID: route.idroute, status: 'true'});
                   });
                   return;
                }
                this.initRide(route);
            }

        }
        return components.button.genericButton(buttonOptions);
    }

    initRide(route, riders = []) {
        this.exit();
        (new RunningScreen(this.container, riders, route)).init();
    }

    drawRoute(route) {
        const latLngArray = utils.map.formatCoordinateArrayToGoogleAPI(route.routePoints ?? []);
        this.distance = utils.map.calculateCoordinatesDistance(latLngArray);
        this.routeName = route.routename;

        utils.map.createOriginMarker(latLngArray[0])
        utils.map.createDestinationMarker(latLngArray[latLngArray.length - 1]);
        utils.map.showRoute(latLngArray);
    }
}