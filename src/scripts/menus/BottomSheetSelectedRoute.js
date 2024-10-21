import {components, utils} from "../../Globals";
import {FacDriveFunctions} from "../../FacDriveFunctions";

export class BottomSheetSelectedRoute {
    constructor(container, routeID) {
        this.container = container;
        this.favoriteRouteID = routeID;
        this.selectedRouteID = null;
        this.distance = null;
        this.routeName = null;
        this.setFavoriteRouteID = this.setFavoriteRouteID.bind(this);
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

        const startButton = this.createStartRouteButton();
        const backButton = this.createBackButton(container, options.backEvent);
        const favoriteButton = this.createFavoriteButton();

        buttonsContainer.append(startButton, favoriteButton, backButton);

        container.append(label, buttonsContainer);
        this.container.appendChild(container);
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
                            FacDriveFunctions.manegeRouteInLocalStorage('save', this.selectedRouteID);
                            this.setFavoriteRouteID(this.selectedRouteID);
                        })
                    return;
                }

                icon.classList.remove('fa-solid');
                icon.classList.remove('fa-star');
                icon.classList.add('fa-regular');
                icon.classList.add('fa-star');
                buttonClickable.classList.remove('favorite');
                FacDriveFunctions.manegeRouteInLocalStorage('remove');
                this.setFavoriteRouteID(null);
            }
        });

        return button;
    }

    setFavoriteRouteID(routeID) {
        this.favoriteRouteID = routeID;
    }

    createStartRouteButton(route) {
        const buttonOptions = {
            icon: 'fa-solid fa-play',
            class: 'large-button height-50 blue start-button',
            label: 'Iniciar',
            event: async () => {
                console.log('aaaaaaaaaaa')
            }

        }
        return components.button.genericButton(buttonOptions);
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