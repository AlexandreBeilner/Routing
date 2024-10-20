import {components, route, utils} from "../../Globals";
import {FacDriveFunctions} from "../../FacDriveFunctions";
import {SaveRouteModal} from "../Modals/SaveRouteModal";

export class CreateRoutesMenu {

    constructor(container) {
        this.container = container;
        this.distance = null;
        this.showBottomSheetMenu = this.showBottomSheetMenu.bind(this);
        this.exit = this.exit.bind(this);
        this.saveRouteCallback = this.saveRouteCallback.bind(this);
    }

    init() {
        route.createRouteIsActive = true;
        utils.map.setCallback(this.updateButtonsState);

        this.menuContainer = document.createElement('div');
        this.menuContainer.setAttribute('id', 'routes-menu-container');
        this.menuContainer.setAttribute('class', 'expanded')
        const distanceComponent = this.createDistanceComponent();

        const completeRouteButton = this.createCompleteRouteButton();
        const backLastPointButton = this.createBackLastPointButton();
        const restartButton = this.createRestartButton();
        const saveButton = this.createSaveButton();
        const exitButton = this.createExitButton();

        this.bottomButtonsContainer = document.createElement('div');
        this.bottomButtonsContainer.setAttribute('class', 'create-routes-bottom-buttons')
        this.bottomButtonsContainer.append(exitButton, saveButton);

        this.actionButtonsContainer = document.createElement('div');
        this.actionButtonsContainer.setAttribute('class', 'create-routes-bottom-buttons')
        this.actionButtonsContainer.append(completeRouteButton, backLastPointButton, restartButton)

        const resizeButton = this.createResizeMenuButton();

        this.menuContainer.append(resizeButton, distanceComponent, this.actionButtonsContainer, this.bottomButtonsContainer);
        this.container.append(this.menuContainer);
    }

    exit() {
        route.createRouteIsActive = false;
        this.showBottomSheetMenu();
        this.menuContainer.remove();
    }

    showBottomSheetMenu() {
        const circleButton = document.getElementById('circle-button');
        circleButton.classList.remove('hide')
        circleButton.classList.add('up-button')

        const bottomSheetMenu = document.getElementById('bottom-sheet-menu');
        bottomSheetMenu.classList.add('expanded')
    }

    createDistanceComponent() {
        const distanceComponent = document.createElement('div');
        distanceComponent.setAttribute('class', 'distance-component');

        this.distance = document.createElement('span');
        this.distance.setAttribute('id', 'create-routes-menu-distance')
        this.distance.setAttribute('class', 'label-distance');
        this.distance.innerHTML = "0 KM";

        distanceComponent.appendChild(this.distance);
        return distanceComponent
    }

    createSaveButton() {
        const button = components.button.createCircleButtonWithLabel({
            buttonClass: 'disabled',
            buttonId: 'save-create-routes-menu-button',
            icon: 'fa-regular fa-floppy-disk',
            label: 'Salvar',
            color: 'green',
            event: () => {
                const routePoints = utils.map.getRoutePoints();
                const lastPointDraw = routePoints[routePoints.length - 1] ?? []
                const distance = utils.map.calculateCoordinatesDistance([utils.destination, lastPointDraw]);
                const twoHundredMeters = 0.2;
                if (distance > twoHundredMeters) {
                    components.alert.init('Não é possível salvar! A distância entre seu último ponto desenhado e a chegada é muito grande! Continue desenhando.', 'error');
                    return;
                }
                SaveRouteModal.init(this.saveRouteCallback, this.container, routePoints);
            }
        })

        return button;
    }

    createExitButton() {
        const button = components.button.createCircleButtonWithLabel({
            buttonId: 'exit-create-routes-menu-button',
            icon: 'fa-solid fa-arrow-right-from-bracket',
            label: 'Sair',
            color: 'red',
            event: () => {
                this.exit()
                utils.map.clearMap();
            }
        })
        return button
    }

    createCompleteRouteButton() {
        const button = components.button.createCircleButtonWithLabel({
            buttonClass: 'disabled',
            buttonId: 'complete-create-routes-menu-button',
            icon: 'fa-solid fa-thumbtack',
            label: 'Completar caminho',
            event: async () => {
                await utils.map.completeRoute()
            }
        })

        return button;
    }

    createBackLastPointButton() {
        const button = components.button.createCircleButtonWithLabel({
            buttonClass: 'disabled',
            buttonId: 'back-create-routes-menu-button',
            icon: 'fa-solid fa-rotate-left',
            label: 'Voltar ponto',
            event: () => {
                utils.map.backOnePoint();
            }
        })

        return button;
    }

    createRestartButton() {
        const button = components.button.createCircleButtonWithLabel({
            buttonClass: 'disabled',
            buttonId: 'restart-create-routes-menu-button',
            icon: 'fa-solid fa-repeat',
            label: 'Reiniciar',
            event: async () => {
                const userPosition = await FacDriveFunctions.getUserCoordinates();
                utils.map.setMapCenter(userPosition);
                utils.map.resetDefaultState();
                FacDriveFunctions.updateDistance('create-routes-menu-distance', 0)
            }
        })
        return button;
    }

    createResizeMenuButton() {
        const resizeContainerButton = document.createElement('div');
        resizeContainerButton.setAttribute('class', 'resize-menu-button-container');
        const iconOpen = document.createElement('i');
        iconOpen.setAttribute('class', 'fa-solid fa-chevron-down')
        resizeContainerButton.appendChild(iconOpen);

        let isOpen = true;
        resizeContainerButton.addEventListener('click', () => {
            if (isOpen) {
                const height = this.bottomButtonsContainer.offsetHeight + this.actionButtonsContainer.offsetHeight;
                iconOpen.classList.remove('fa-chevron-down');
                iconOpen.classList.add('fa-chevron-up');
                this.menuContainer.style.bottom = `-${height}px`;
            } else {
                iconOpen.classList.remove('fa-chevron-up');
                iconOpen.classList.add('fa-chevron-down');
                this.menuContainer.style.bottom = '0px';
            }
            isOpen = !isOpen;
        });

        return resizeContainerButton;
    }

    saveRouteCallback() {
        this.exit()
        utils.map.clearMap();
    }

    updateButtonsState(routePoints) {
        if (routePoints.length < 2) {
            const restartButton = document.getElementById('restart-create-routes-menu-button');
            const saveButton = document.getElementById('save-create-routes-menu-button');
            const backPointButton = document.getElementById('back-create-routes-menu-button');
            const completeButton = document.getElementById('complete-create-routes-menu-button');
            if (routePoints.length === 0) {
                restartButton?.classList.add('disabled');
                saveButton?.classList.add('disabled');
                backPointButton?.classList.add('disabled');
                completeButton?.classList.add('disabled');
                return;
            }
            restartButton?.classList.remove('disabled');
            saveButton?.classList.remove('disabled');
            backPointButton?.classList.remove('disabled');
            completeButton?.classList.remove('disabled');
        }
    }
}