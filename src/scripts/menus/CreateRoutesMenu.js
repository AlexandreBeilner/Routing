import {components, route, utils} from "../../Globals";

export class CreateRoutesMenu {

    constructor(container) {
        this.container = container;
        this.distance = null;
        this.showBottomSheetMenu = this.showBottomSheetMenu.bind(this);
        this.saveRoute = this.saveRoute.bind(this);
    }

    init() {
        route.createRouteIsActive = true;

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
        this.distance.setAttribute('class', 'label-distance');
        this.distance.innerHTML = "0 KM";

        distanceComponent.appendChild(this.distance);
        return distanceComponent
    }

    createSaveButton() {
        const button = components.button.createCircleButtonWithLabel({
            icon: 'fa-regular fa-floppy-disk',
            label: 'Salvar',
            color: 'green',
            event: () => {
                console.log('cabar')
            }
        })

        return button;
    }

    createExitButton() {
        const button = components.button.createCircleButtonWithLabel({
            icon: 'fa-solid fa-arrow-right-from-bracket',
            label: 'Sair',
            color: 'red',
            event: () => {
                this.exit()
            }
        })
        return button
    }

    createCompleteRouteButton() {
        const button = components.button.createCircleButtonWithLabel({
            icon: 'fa-solid fa-thumbtack',
            label: 'Completar caminho',
            event: () => {
                console.log('cabar')
            }
        })

        return button;
    }

    createBackLastPointButton() {
        const button = components.button.createCircleButtonWithLabel({
            icon: 'fa-solid fa-rotate-left',
            label: 'Voltar ponto',
            event: () => {
                console.log('cabar')
            }
        })

        return button;
    }

    createRestartButton() {
        const button = components.button.createCircleButtonWithLabel({
            icon: 'fa-solid fa-repeat',
            label: 'Reiniciar',
            event: () => {
                console.log('cabar')
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

        resizeContainerButton.addEventListener('click', () => {
            this.bottomButtonsContainer.classList.toggle('collapsed')
            this.actionButtonsContainer.classList.toggle('collapsed')
            if (iconOpen.classList.contains('fa-chevron-down')) {
                iconOpen.classList.remove('fa-chevron-down');
                iconOpen.classList.add('fa-chevron-up');
            } else {
                iconOpen.classList.remove('fa-chevron-up');
                iconOpen.classList.add('fa-chevron-down');
            }
        })

        return resizeContainerButton;
    }

    saveRoute() {

    }

    updateDistanceComponent() {
        const distance = utils.map.calculateCoordinatesDistance(route.coordinates);
        this.distance.innerHTML = distance + " KM";
    }
}