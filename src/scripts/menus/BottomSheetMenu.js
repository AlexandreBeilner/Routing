import {components, menus, userConfig, utils} from "../../Globals";
import {MyRoutesScreen} from "../Screens/MyRoutesScreen";
import {FindRideScreen} from "../Screens/FindRideScreen";
import {FacDriveRoutes} from "../routes/FacDriveRoutes";

export class BottomSheetMenu {
    constructor(container) {
        this.container = container;
        this.bottomSheet = null;
        this.expandedButton = null;
        this.expandedMenu = this.expandedMenu.bind(this);
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

    toggleMenuVisibility() {
        const circleButton = document.getElementById('circle-button');
        circleButton.classList.toggle('up-button')
        circleButton.classList.toggle('hide')
        this.bottomSheet.classList.toggle('expanded')
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
        labelMenu.innerHTML = 'Buscar por carona';
        this.headerMenu.append(labelMenu);

        this.bodyMenu.setAttribute('id', 'body-bottom-sheet')

        const findRideButton = this.createFindRideButton();

        this.bodyMenu.append(findRideButton);
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
                let coordinates = {lat: utils.userPosition.latitude, lng: utils.userPosition.longitude};
                if (! (utils.userPosition.longitude && utils.userPosition.latitude)) {
                    const request = await FacDriveRoutes.getCoordinatesByUserAddress(userConfig.iduser);
                    coordinates = {lat: request.response.latitude, lng: request.response.longitude};
                }
                await utils.map.getBestRoute(coordinates);
                this.toggleMenuVisibility();
                this.bottomSheetSaveRoute();
            }
        }
        return components.button.genericButton(buttonOptions);
    }

    createCreateRouterButton() {
        const buttonOptions = {
            icon: 'fa-solid fa-plus',
            class: 'medium-button orange',
            label: 'Criar rota',
            event: () => {
                this.toggleMenuVisibility();
                menus.createRoutesMenu.init()
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
            class: 'large-button height-100 blue',
            label: 'Encontrar carona',
            event: () => {
                this.findRideScreen.init();
            }
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

    createSaveRouteModal() {
        const modal = document.createElement('div');
        modal.setAttribute('class', 'save-route-modal');

        const routeName = components.input.createInput({
            label: 'Nome da rota',
            input: {
                id: 'route-name',
                class: 'route-name',
                type: 'text',
                placeholder: 'Digite o nome da rota'
            },
            tip: "Digite um nome para a sua rota, dessa forma será possivel acessa-lá posteriormente."
        })

        const saveButton = components.button.genericButton({
            icon: 'fa-regular fa-floppy-disk',
            class: 'large-button height-50 green',
            label: 'Salvar',
            event: async () => {
                const routeName = document.getElementById('route-name')?.value;
                if (routeName) {
                    const routePoints = utils.map.getRoutePoints();
                    await FacDriveRoutes.saveRoute(userConfig.iduser, routeName, routePoints);
                    components.alert.init('A sua rota foi salva com sucesso!', 'success');
                    components.darkBackground.exit();
                    this.toggleMenuVisibility();
                    document.getElementById('bottom-sheet-save-route')?.remove();
                    return;
                }
                components.alert.init('Preencha o nome da rota antes de salvar', 'error');
            }
        });

        const exitButton = components.button.createExitButton({
            id: 'exit-save-route-modal',
            event: () => {
                components.darkBackground.exit();
            }
        });

        modal.append(exitButton, routeName, saveButton);
        components.darkBackground.create(this.container, modal);
    }

    bottomSheetSaveRoute() {
        const container = document.createElement('div');
        container.setAttribute('id', 'bottom-sheet-save-route')
        container.setAttribute('class', 'bottom-sheet-save-route')
        const exitButton = components.button.createCircleButtonWithLabel({
            icon: 'fa-solid fa-arrow-right-from-bracket',
            label: 'Sair',
            color: 'red',
            event: () => {
                this.toggleMenuVisibility();
                container.remove();
                utils.map.clearMap();
            }
        })
        const saveButton = components.button.createCircleButtonWithLabel({
            icon: 'fa-regular fa-floppy-disk',
            label: 'Salvar',
            color: 'green',
            event: () => {
                this.createSaveRouteModal()
            }
        })

        const distance = document.createElement('span');
        distance.innerText = `Distancia: ${utils.map.getDistance()} km`

        container.append(exitButton, distance, saveButton);
        this.container.appendChild(container);
    }
}
