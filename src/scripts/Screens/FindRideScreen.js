import {components, userConfig, utils} from "../../Globals";
import {FacDriveRoutes} from "../routes/FacDriveRoutes";

export class FindRideScreen {
    constructor(container) {
        this.container = container;
    }
    init() {
        if (this.screenContainer) {
            this.toggleVisibility()
            return;
        }
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

        this.darkBackground = document.createElement('div');
        this.darkBackground.setAttribute('id', 'dark-background');
        this.darkBackground.appendChild(this.screenContainer)

        this.container.append(this.darkBackground);
    }

    exit() {
        this.darkBackground.remove();
    }

    toggleVisibility() {
        this.darkBackground.classList.toggle('hide');
    }

    createExitButton() {
        const exitButton = components.button.createExitButton({
            id: 'exit-find-riders-screen',
            event: () => {
                this.toggleVisibility();
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
                const distance = document.getElementById('distance-input')?.value ?? 50

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
            const userRoute = await FacDriveRoutes.getCompleteRouteByRouteID(options.routeID);
            const coordinates = utils.map.formatCoordinateArrayToPolyline(userRoute.response.routePoints);
            utils.map.showRoute(coordinates, {lat: utils.userPosition.latitude, lng: utils.userPosition.longitude}, userConfig.userimage)
            this.toggleVisibility();
        });

        component.append(userName, distance, daysOfWeekContainer, showRouteButton);
        return component;
    }
}