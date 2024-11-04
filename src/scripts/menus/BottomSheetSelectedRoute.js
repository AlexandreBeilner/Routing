import {components, facdriveSocket, userConfig, utils} from "../../Globals";
import {FacDriveFunctions} from "../../FacDriveFunctions";
import {FacDriveRoutes} from "../routes/FacDriveRoutes";
import {StartRideModal} from "../Modals/StartRideModal";
import {RunningScreen} from "../Screens/RunningScreen";
import {ManageLocalStorage} from "../service/ManageLocalStorage";

export class BottomSheetSelectedRoute {
    constructor(container, routeID) {
        this.container = container;
        this.favoriteRouteID = routeID;
        this.selectedRouteID = null;
        this.distance = null;
        this.routeName = null;
        this.setFavoriteRouteID = this.setFavoriteRouteID.bind(this);
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
        const favoriteButton = this.createFavoriteButton();

        buttonsContainer.append(startButton, favoriteButton, backButton);

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

    createFavoriteButton() {
        const check = Number(this.favoriteRouteID) === Number(this.selectedRouteID);
        const button = components.button.createCircleButtonWithLabel({
            buttonClass: check ? 'favorite' : '',
            buttonId: 'favorite-route-button',
            icon:  check ? 'fa-solid fa-star' : 'fa-regular fa-star',
            label: 'Favoritar',
            color: 'modern',
            event: () => {
                const buttonClickable = button.firstChild;
                const icon = buttonClickable.firstChild;

                if (!buttonClickable.classList.contains('favorite')) {
                    components.genericModal.init(
                        this.container,
                        'Favoritar',
                        'Ao favorita uma rota, sempre que acessar essa tela ela irá aparecer. Deseja continuar?',
                        () => {
                            icon.classList.remove('fa-regular');
                            icon.classList.remove('fa-star');
                            icon.classList.add('fa-solid');
                            icon.classList.add('fa-star');
                            buttonClickable.classList.add('favorite');
                            ManageLocalStorage.manage('save', 'routeID', this.selectedRouteID)
                            this.setFavoriteRouteID(this.selectedRouteID);
                        })
                    return;
                }

                icon.classList.remove('fa-solid');
                icon.classList.remove('fa-star');
                icon.classList.add('fa-regular');
                icon.classList.add('fa-star');
                buttonClickable.classList.remove('favorite');
                ManageLocalStorage.manage('delete', 'routeID');
                this.setFavoriteRouteID(null);
            }
        });

        return button;
    }

    setFavoriteRouteID(routeID) {
        this.favoriteRouteID = routeID;
    }

    createStartRouteButton(route) {
        const routeID = route.idroute;
        const driverID = route.iduser;
        const buttonOptions = {
            icon: 'fa-solid fa-play',
            class: 'large-button height-50 blue start-button',
            label: 'Iniciar',
            event: async () => {
                const resp = await FacDriveRoutes.getRouteRiders(driverID, routeID);
                if (resp.response && resp.response.length > 0) {
                   (new StartRideModal()).init(this.container, resp.response, () => {
                       facdriveSocket.sendMessageToUser({
                           routeID, driverID,
                           message: {
                               text: 'SUA CARONA SAIU!',
                               title: `O(A) motorista ${userConfig.name} ${userConfig.surname} sairá para a corrida em alguns instantes, fique pronto no local mais próximo a você. Uma boa viagem!`
                           }
                       })
                       this.initRide(route, resp.response)
                   });
                   return;
                }
                this.initRide(route);
            }

        }
        return components.button.genericButton(buttonOptions);
    }

    initRide(route, riders = []) {
        if (riders.length > 0) {
            riders.forEach(item => {
                const riderName = item.ridername + ' ' + item.ridersurname
                utils.map.createRidersMarker({lat: Number(item.latitude), lng: Number(item.longitude)}, riderName);
            })
            components.darkBackground.exit('dark-background-start-ride-modal');
            components.alert.init('Os caroneiros foram marcados no mapa em seus respesctivos locais!', 'success');
        }
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