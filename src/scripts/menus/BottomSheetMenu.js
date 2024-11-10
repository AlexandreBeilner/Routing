import {components, menus, userConfig, utils} from "../../Globals";
import {MyRoutesScreen} from "../Screens/MyRoutesScreen";
import {FindRideScreen} from "../Screens/FindRideScreen";
import {FacDriveFunctions} from "../../FacDriveFunctions";
import {SaveRouteModal} from "../Modals/SaveRouteModal";
import {MyRidesScreen} from "../Screens/MyRidesScreen";

export class BottomSheetMenu {
    constructor(container) {
        this.container = container;
        this.bottomSheet = null;
        this.expandedButton = null;
        this.expandedMenu = this.expandedMenu.bind(this);
        this.saveRouteCallback = this.saveRouteCallback.bind(this);
        this.createExpandedButton = this.createExpandedButton.bind(this);
        this.createDriverMenu = this.createDriverMenu.bind(this);
        this.createPassengerMenu = this.createPassengerMenu.bind(this)
        this.findRideScreen = new FindRideScreen(container);
    }

    init() {
        this.createExpandedButton();
        this.bottomSheet = document.createElement('div');
        this.bottomSheet.setAttribute('id', 'bottom-sheet-menu');
        this.headerMenu = document.createElement('div');
        this.bodyMenu = document.createElement('div');

        if (userConfig.isdriver) {
            this.createDriverMenu();
        } else {
            this.createPassengerMenu();
        }

        this.bottomSheet.append(this.headerMenu, this.bodyMenu);
        this.container.appendChild(this.bottomSheet);
    }

    exit() {
        this.bottomSheet.remove();
    }

    createDriverMenu() {
        this.bottomSheet.classList.add('bottom-sheet', 'driver');
        this.headerMenu.classList.add('header-bottom-sheet', 'driver');
        this.bodyMenu.classList.add('body-bottom-sheet', 'driver')

        const labelMenu = document.createElement('span');
        labelMenu.innerHTML = 'Menu de rotas';
        this.headerMenu.append(labelMenu);

        const myRoutesButton = this.createMyRoutesButton();
        const createRouterButton = this.createCreateRouterButton();
        const betterRouterButton = this.createBetterRouterButton();

        this.bodyMenu.append(myRoutesButton, createRouterButton, betterRouterButton);
    }

    createPassengerMenu() {
        this.bottomSheet.classList.add('bottom-sheet', 'passenger');
        this.headerMenu.classList.add('header-bottom-sheet', 'passenger');
        this.bodyMenu.classList.add('body-bottom-sheet', 'passenger')

        const labelMenu = document.createElement('span');
        labelMenu.innerHTML = 'Menu de Caronas';
        this.headerMenu.append(labelMenu);

        this.bodyMenu.setAttribute('id', 'body-bottom-sheet')

        const findRideButton = this.createFindRideButton();
        const myRidesButton = this.createMyRidesButton();

        this.bodyMenu.append(findRideButton, myRidesButton);
    }

    createExpandedButton() {
        const buttonOptions = {
            icon: 'fa-solid fa-bars',
            class: 'expanded-button',
            event: this.expandedMenu
        };
        this.expandedButton = components.button.circleButton(buttonOptions)
        this.container.appendChild(this.expandedButton);
    }

    createMyRoutesButton() {
        const buttonOptions = {
            icon: 'fa-solid fa-road-circle-check',
            class: 'medium-button green',
            label: 'Melhor caminho',
            event: async () => {
                const coordinates = await FacDriveFunctions.getUserCoordinates();
                const routePoints = await utils.map.setBestRoute(coordinates);
                utils.map.createDestinationMarker()
                utils.map.createOriginMarker(routePoints[0])
                const distance = utils.map.calculateCoordinatesDistance(routePoints);
                utils.map.showRoute(routePoints);
                FacDriveFunctions.togglePrincipalMenuVisibility('hide');
                this.bottomSheetSaveRoute(distance);
            }
        }
        return components.button.genericButton(buttonOptions);
    }

    createCreateRouterButton() {
        const buttonOptions = {
            icon: 'fa-solid fa-plus',
            class: 'medium-button orange',
            label: 'Criar rota',
            event: async () => {
                FacDriveFunctions.togglePrincipalMenuVisibility('hide');
                menus.createRoutesMenu.init()
                let coordinates = await FacDriveFunctions.getUserCoordinates();
                utils.map.setMapCenter(coordinates);
                utils.map.createDestinationMarker();
            }
        }
        return components.button.genericButton(buttonOptions);
    }

    createBetterRouterButton() {
        const buttonOptions = {
            icon: 'fa-solid fa-map',
            class: 'large-button height-50 blue',
            label: 'Minhas rotas',
            event: async () => (new MyRoutesScreen(this.container).init())

        }
        return components.button.genericButton(buttonOptions);
    }

    createFindRideButton() {
        const buttonOptions = {
            icon: 'fa-solid fa-magnifying-glass',
            class: 'medium-button height-100 blue',
            label: 'Encontrar carona',
            event: () => {
                this.findRideScreen.init();
            }
        }
        return components.button.genericButton(buttonOptions);
    }

    createMyRidesButton() {
        const buttonOptions = {
            icon: 'fa-solid fa-magnifying-glass',
            class: 'medium-button height-100 blue',
            label: 'Minhas Caronas',
            event: async () => (new MyRidesScreen(this.container).init())

        }
        return components.button.genericButton(buttonOptions);
    }

    expandedMenu() {
        this.bottomSheet.classList.toggle('expanded');
        let upButtonClass = 'up-button-driver';
        if (! userConfig.isdriver) {
            upButtonClass = 'up-button-passenger'
        }
        this.expandedButton.classList.toggle(upButtonClass);
    }

    saveRouteCallback() {
        FacDriveFunctions.togglePrincipalMenuVisibility('show');
        document.getElementById('bottom-sheet-save-route')?.remove();
    }

    bottomSheetSaveRoute(distanceKM) {
        const container = document.createElement('div');
        container.setAttribute('id', 'bottom-sheet-save-route')
        container.setAttribute('class', 'bottom-sheet-save-route')
        const exitButton = components.button.createCircleButtonWithLabel({
            buttonId: 'exit-bottom-sheet-menu-button',
            icon: 'fa-solid fa-arrow-right-from-bracket',
            label: 'Sair',
            color: 'red',
            event: () => {
                FacDriveFunctions.togglePrincipalMenuVisibility('show');
                container.remove();
                utils.map.clearMap();
            }
        })
        const saveButton = components.button.createCircleButtonWithLabel({
            buttonId: 'save-bottom-sheet-menu-button',
            icon: 'fa-regular fa-floppy-disk',
            label: 'Salvar',
            color: 'green',
            event: () => {
                SaveRouteModal.init(this.saveRouteCallback, this.container, utils.map.getBestRoutePoints());
            }
        })

        const distance = document.createElement('span');
        distance.innerText = `Distancia: ${distanceKM} km`

        container.append(exitButton, distance, saveButton);
        this.container.appendChild(container);
    }
}
