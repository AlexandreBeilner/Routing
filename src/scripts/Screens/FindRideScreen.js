import {components, userConfig, utils} from "../../Globals";
import {FacDriveRoutes} from "../routes/FacDriveRoutes";
import {FacDriveFunctions} from "../../FacDriveFunctions";

export class FindRideScreen {
    constructor(container) {
        this.container = container;
    }
    init() {
        this.screenContainer = document.createElement('div');
        this.screenContainer.setAttribute('id', 'find-rider-screen');
        this.screenContainer.classList.add('default-screen-style');
        this.createExitButton();

        const searchRiderContainer = document.createElement('div');
        searchRiderContainer.setAttribute('class', 'search-rider-container');
        const distanceInput = this.createDistanceInput();
        const searchButton = this.createSearchButton();

        searchRiderContainer.append(distanceInput, searchButton);

        this.createContentContainer();

        this.screenContainer.append(searchRiderContainer, this.contentContainer);

        components.darkBackground.create(this.container, this.screenContainer, 'dark-background-find-ride-screen', true);
    }

    exit() {
        components.darkBackground.exit('dark-background-find-ride-screen');
    }


    createExitButton() {
        const exitButton = components.button.createExitButton({
            id: 'exit-find-riders-screen',
            event: () => {
                this.exit();
            }
        })
        this.screenContainer.append(exitButton);
    }

    createDistanceInput() {
        return  components.input.createInput({
            label: 'Buscar por carona',
            numeric: true,
            input: {
                id: 'distance-input',
                class: 'distance-input',
                min: '0',
                type: 'text',
                placeholder: 'Digite a distância em metros'
            },
            tip: "Digite a distância em metros para encontrar caronas disponíveis nas proximidades."
        })
    }

    createSearchButton() {
        const buttonOptions = {
            icon: 'fa-solid fa-magnifying-glass',
            class: 'large-button height-50 blue',
            label: 'Buscar',
            event: async () => {
                utils.map.requestLocationPermission();
                const distance = document.getElementById('distance-input')?.value || 50

                components.spinner.init(this.contentRides);
                const results = await FacDriveRoutes.getNearbyRoutes({
                    longitude: utils.userPosition.longitude,
                    latitude: utils.userPosition.latitude,
                    userID: userConfig.iduser,
                    distance: distance
                });
                components.spinner.exit();

                if (results.response.length === 0) {
                    this.contentRides.innerHTML = 'Nenhum resultado encontrado para esta distancia!';
                    return;
                }

                results.response.map(item => {
                    const element = this.createResultsComponent(item);
                    this.contentRides.appendChild(element);
                })
            }
        }

        return components.button.genericButton(buttonOptions);
    }

    createContentContainer() {
        this.contentContainer = document.createElement('div');
        this.contentContainer.setAttribute('class', 'content-rides-container');

        const text = document.createElement('span');
        text.innerText = 'Resultados';

        this.contentRides = document.createElement('div');
        this.contentRides.setAttribute('id', 'content-rides');
        this.contentRides.setAttribute('class', 'content-rides without-rides');

        this.contentRides.innerHTML = 'Busque e os resultados aparecerão aqui!'

        this.contentContainer.append(text, this.contentRides);
    }

    createResultsComponent(options) {
        const component = document.createElement('div');
        component.setAttribute('class', 'find-routes-result');

        const userName = document.createElement('span');
        userName.setAttribute('class', 'user-name');
        userName.innerText = options.userName;

        const distance = document.createElement('span');
        distance.setAttribute('class', 'user-distance');
        distance.innerText = "Distância até a carona: " + options.distance + " metros";

        const daysOfWeekContainer = document.createElement('div');
        daysOfWeekContainer.setAttribute('class', 'days-of-week-container');

        options.classDays.map(item => {
            const day = document.createElement('div');
            day.setAttribute('class', 'day-of-week');
            day.innerText = item.name;

            if (item.isGoing) {
                day.classList.add('going');
            }

            daysOfWeekContainer.appendChild(day);
        });

        const showRouteButton = document.createElement('button');
        showRouteButton.setAttribute('class', 'show-user-route-button');
        showRouteButton.innerText = 'Ver Rota';
        showRouteButton.addEventListener('click', async () => {
            FacDriveFunctions.togglePrincipalMenuVisibility('hide');
            const userRoute = await FacDriveRoutes.getCompleteRouteByRouteID(options.routeID);
            const coordinates = utils.map.formatCoordinateArrayToGoogleAPI(userRoute.response.routePoints);
            utils.map.createDestinationMarker()
            utils.map.createOriginMarker(coordinates[0])
            utils.map.showRoute(coordinates)
            components.darkBackground.toggleVisibility('dark-background-find-ride-screen');
            this.createBottomSheetSelectDriverRoute(options);
        });

        component.append(userName, distance, daysOfWeekContainer, showRouteButton);
        return component;
    }

    createBottomSheetSelectDriverRoute(options) {
        const container = document.createElement('div');
        container.setAttribute('class', 'bottom-sheet-select-driver-route');

        const actionButtons = document.createElement('div');
        actionButtons.setAttribute('class', 'action-buttons-select-diver-route')

        const buttonOptions = {
            icon: 'fa-solid fa-circle-check',
            class: 'large-button height-50 green start-button',
            label: 'Selecionar carona',
            event: async () => {
                components.genericModal.init(
                    this.container,
                    'Selecionar Carona',
                    'Ao clicar em confirmar será criado uma relação entre você e o motorista. Sempre que o motorista iniciar a corrida, você receberá uma notificação que ele está chegando.' +
                    ' Tem certeza que deseja continuar?',
                    () => {
                        console.log('calabreso');
                    }
                    )
            }

        }
        const selectRouteButton = components.button.genericButton(buttonOptions);

        const exitButton = components.button.createCircleButtonWithLabel({
            buttonId: 'exit-bottom-sheet-find-ride-button',
            icon: 'fa-solid fa-arrow-right-from-bracket',
            label: 'Sair',
            color: 'red',
            event: () => {
                FacDriveFunctions.togglePrincipalMenuVisibility('show');
                components.darkBackground.toggleVisibility('dark-background-find-ride-screen');
                container.remove();
                utils.map.clearMap();
            }
        })

        actionButtons.append(selectRouteButton, exitButton);

        const routeInfos = document.createElement('div');
        routeInfos.setAttribute('class', 'driver-route-infos');

        const driverName = document.createElement('span');
        driverName.innerHTML = '<b>Motorista: </b>' + options.userName;
        const routeDistance = document.createElement('span');
        routeDistance.innerHTML = '<b>Distância até a carona: </b>' + options.distance;
        const classDays = document.createElement('span');
        classDays.innerHTML = '<b>Tem aula: </b>' + options.classDays
            .filter(item => item.isGoing === true)
            .reduce((acc, item, index, array) => {
                return acc + item.name + (index < array.length - 1 ? ', ' : '');
            }, '');

        routeInfos.append(driverName, routeDistance, classDays);

        container.append(routeInfos, actionButtons);

        this.container.appendChild(container);
    }
}