import {components, facdriveSocket, route, userConfig, utils} from "../../Globals";
import {FacDriveFunctions} from "../../FacDriveFunctions";
import destinationImage from '../../assets/images/bandeira-branca.png';
import riderImage from '../../assets/images/riderPin.png';
import startImage from '../../assets/images/pin.png';
import {FacDriveRoutes} from "../routes/FacDriveRoutes";
let timeOutRequestRiders;

export class RunningScreen {
    constructor(container, riders = [], route) {
        this.isDriver = userConfig.isdriver;
        this.container = container;
        this.riders = riders;
        this.route = route;
        this.routePoints = utils.map.formatCoordinateArrayToGoogleAPI(route.routePoints);
        this.routeLine = null;
        this.distanceInKm = null;
    }

    init() {
        utils.map.clearMap();
        utils.map.setMapCenter({lat: utils.userPosition.latitude, lng: utils.userPosition.longitude});
        FacDriveFunctions.togglePrincipalMenuVisibility('hide');
        this.drawRoute();
        this.createHeader();
        this.createBottomScreen();
        this.setTimerOutRequestRiders();
    }

    static exit() {
        utils.map.clearMap();
        utils.map.setMapCenter({lat: utils.userPosition.latitude, lng: utils.userPosition.longitude});
        document.querySelector('.running-screen-header')?.remove();
        document.querySelector('.running-screen-bottom')?.remove();
        clearInterval(timeOutRequestRiders);
        document.getElementById('pac-input')?.classList.remove('down');
        FacDriveFunctions.togglePrincipalMenuVisibility('show');
    }

    setTimerOutRequestRiders() {
        if (userConfig.isdriver) {
            timeOutRequestRiders = setInterval(async () => {
                const resp = await FacDriveRoutes.getRouteRiders(userConfig.iduser, this.route.idroute, 'true');
                const arrayCompare = FacDriveFunctions.compareObjectArrays(this.riders, resp.response);
                if (! arrayCompare.areEqual) {
                    utils.map.clearMap();
                    this.riders = resp.response;
                    this.drawRoute();
                    this.routeLine.querySelectorAll('.marker-image-container')?.forEach(item => {
                        item.remove();
                    })
                    this.drawRouteAndRiders();
                }
            }, 10000)
        }
    }

    drawRoute() {
        utils.map.createOriginMarker(this.routePoints[0])
        utils.map.createDestinationMarker(this.routePoints[this.routePoints.length - 1]);
        utils.map.showRoute(this.routePoints);
        this.riders.forEach(item => {
            const riderName = item.ridername + ' ' + item.ridersurname
            utils.map.createRidersMarker({lat: Number(item.latitude), lng: Number(item.longitude)}, riderName);
        })
        components.darkBackground.exit('dark-background-start-ride-modal');
        // components.alert.init('Os caroneiros foram marcados no mapa em seus respesctivos locais!', 'success');
    }

    createBottomScreen() {
        const bottom = document.createElement('div');
        bottom.setAttribute('class', 'running-screen-bottom');

        this.routeLine = document.createElement('div');
        this.routeLine.setAttribute('class', 'running-screen-route');

        const startMarker = document.createElement('div');
        startMarker.setAttribute('class', 'marker-image start-marker');
        startMarker.style.backgroundImage = `url(${startImage})`;

        const destinationMarker = document.createElement('div');
        destinationMarker.setAttribute('class', 'marker-image destination-marker');
        destinationMarker.style.backgroundImage = `url(${destinationImage})`;

        this.distanceInKm = utils.map.calculateCoordinatesDistance(this.routePoints);
        const totalDistance = document.createElement('span');
        totalDistance.innerText = `Distância: ${this.distanceInKm}km`;

        this.routeLine.appendChild(startMarker);
        this.routeLine.appendChild(destinationMarker);

        bottom.append(totalDistance, this.routeLine, this.isDriver ? this.createActionButtonsToDriver() : this.createActionButtonsToRider());
        this.container.append(bottom);
        this.drawRouteAndRiders();
    }

    drawRouteAndRiders() {
        if (this.riders.length > 0) {
            const ridersDistance = this.calculateRidesDistance();
            ridersDistance.forEach(item => {
                const container = document.createElement('div');
                container.setAttribute('class', 'marker-image-container')
                const elementDistance = document.createElement('span');
                const elementName = document.createElement('span');

                elementDistance.innerText = item.distance + 'km';
                elementName.innerText = item.name;

                const riderMarker = document.createElement('div');
                riderMarker.setAttribute('class', 'rider-marker');
                riderMarker.style.backgroundImage = `url(${riderImage})`;

                const routeDistancePX = this.routeLine.offsetWidth;
                const riderPosition = (item.distance * routeDistancePX) / this.distanceInKm;

                container.append(elementDistance, riderMarker, elementName);

                container.style.left = `${riderPosition}px`;
                this.routeLine.appendChild(container);
            })
        }
    }

    createHeader() {
        const header = document.createElement('div');
        header.setAttribute('class', 'running-screen-header');

        document.getElementById('pac-input')?.classList.add('down');

        const status = document.createElement('span');
        status.innerText = `Status: ${this.isDriver ? 'Corrida em andamento' : 'Aguardando carrona'}`;

        header.append(status);

        this.container.append(header);
    }

    calculateRidesDistance() {
        const ridersDistance = [];
        this.riders.forEach(item => {
            const coordinates = [];
            for (const routePoint of this.routePoints) {
                coordinates.push(routePoint);
                if (Number(routePoint.lat) === Number(item.latitude) && Number(routePoint.lng) === Number(item.longitude)) {
                    break;
                }
            }
            ridersDistance.push({
                name: item.ridername + ' ' + item.ridersurname,
                distance: utils.map.calculateCoordinatesDistance(coordinates)
            })
        })
        return ridersDistance;
    }

    createActionButtonsToDriver() {
        const cancelButton = components.button.genericButton({
            icon: 'fa-solid fa-xmark',
            class: 'medium-button red',
            label: 'Cancelar corrida',
            event: async () => {
                if (this.riders.length === 0) {
                    RunningScreen.exit();
                    return;
                }
                components.genericModal.init(
                    this.container,
                    'Cancelar corrida',
                    'Os caroneiros já foram notificados que você iniciou a corrida. Realmente deseja cancelar? Se sim aperte em confirmar.',
                    async () => {
                        await FacDriveRoutes.setRunningStatus({driverID: userConfig.iduser, routeID: this.route.idroute, status: 'false'});
                        facdriveSocket.rideManager({
                            driverID: this.route.iduser,
                            routeID: this.route.idroute,
                            message: {
                                type: 'endRideCanceled',
                                title: 'ATENÇÃO!!!',
                                text: 'O motorista acabou de cancelar a corrida, ou seja, você não conseguira pegar carona com ele hoje!!' +
                                    ` 
                                    O motivo foi o seguinte: "${document.querySelector(`#running-screen-cancel-message`)?.value}"`
                            }
                        })
                        RunningScreen.exit();
                        components.alert.init('Corrida cancelada com sucesso. Mas não recomendamos isso!','success');
                    }, {
                        id: 'running-screen-cancel-message',
                        placeholder: 'Digite o motivo do cancelamento'
                    }
                )
            }
        })

        const finalizeButton = components.button.genericButton({
            icon: 'fa-solid fa-check',
            class: 'medium-button green',
            label: 'Finalizar corrida',
            event: async () => {
                const resp = await utils.map.requestLocationPermission();
                if (!resp) {
                    components.alert.init('Você precisa conceder acesso a sua localização para conseguir finalizar a corrida.','error');
                    return;
                }
                const distance = utils.map.calculateCoordinatesDistance([utils.destination, {lat: resp.latitude, lng: resp.longitude}]);
                const twoHundredMeters = 0.1;
                if (distance > twoHundredMeters) {
                    components.alert.init('Não é possível finalizar a corrida! A distância entre seu você eo destino é muito grande!', 'error');
                    return;
                }
                await FacDriveRoutes.setRunningStatus({driverID: userConfig.iduser, routeID: this.route.idroute, status: 'false'});
                facdriveSocket.rideManager({
                    driverID: this.route.iduser,
                    routeID: this.route.idroute,
                    message: {
                        type: 'endRideSuccess',
                        title: 'CHEGOU!!!',
                        text: 'O motorista acabou de finalizar a corrida, oque significa que você chegou ao seu destino!'
                    }
                })
                RunningScreen.exit();
            }
        })

        const container = document.createElement('div');
        container.setAttribute('class', 'action-button-running-screen');

        container.append(cancelButton, finalizeButton);
        return container;
    }

    createActionButtonsToRider() {
        const notGoing = components.button.genericButton({
            icon: 'fa-solid fa-triangle-exclamation',
            class: 'large-button blue',
            label: 'Não vou hoje!',
            event: async () => {
                components.genericModal.init(
                    this.container,
                    'Cancelar Carona',
                    'Ao apertar em confirmar você não aparacerá mais como caroneiro para o motorista no dia de hoje. Deseja continuar?',
                    () => {
                        FacDriveRoutes.setRunningStatus({
                            riderID: userConfig.iduser,
                            routeID: this.route.idroute,
                            status: 'false'
                        })
                        RunningScreen.exit();
                    }
                )
            }
        })

        const container = document.createElement('div');
        container.setAttribute('class', 'action-button-running-screen');

        container.append(notGoing);
        return container;
    }
}