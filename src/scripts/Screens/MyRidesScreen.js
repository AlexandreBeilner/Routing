import {components, menus, route, userConfig, utils} from "../../Globals";
import {FacDriveRoutes} from "../routes/FacDriveRoutes";
import {FacDriveFunctions} from "../../FacDriveFunctions";

export class MyRidesScreen {
    constructor(container) {
        this.container = container;
        this.screen = null;
        this.init = this.init.bind(this);
    }

    init() {
        FacDriveFunctions.togglePrincipalMenuVisibility('hide');
        this.screen = document.createElement('div');
        this.screen.setAttribute('id', 'my-rides-screen');
        this.screen.setAttribute('class', 'default-screen-style');

        const header = this.createHeader();
        const body = this.createBody();

        this.screen.appendChild(header);
        this.screen.appendChild(body);

        components.darkBackground.create(this.container, this.screen, 'my-rides-screen-background');
    }

    createHeader() {
        const header = document.createElement('div');
        header.setAttribute('id', 'my-riders-header');

        const label = document.createElement('span');
        label.innerHTML = 'Minhas Caronas';

        const exitButton = this.createExitButton();

        header.append(label, exitButton);
        return header;
    }

    createBody() {
        const body = document.createElement('div');
        body.setAttribute('id', 'my-rides-body');
        components.spinner.init(body);

        FacDriveRoutes.getUserRelationships('riderID', userConfig.iduser).then((resp) => {
            components.spinner.exit();
            if (resp.length === 0) {
                body.innerHTML = 'Você não possui nenhuma carona no momento. No menu inicial vá até Encontrar Carona.'
                return;
            }
            this.createRidesElement(resp, body);
        })

        return body;
    }

    createRidesElement(data, target) {
        data.forEach(async item => {
            const route = await FacDriveRoutes.getCompleteRouteByRouteID(item.idroute);
            let userPosition = await FacDriveFunctions.getUserPosition();
            const coordinates = [
                {lat: Number(item.latitude), lng: Number(item.longitude)},
                {lat: Number(userPosition.latitude), lng: Number(userPosition.longitude)},
            ];
            const distance = utils.map.calculateCoordinatesDistance(coordinates);
            const routeName = route.response.routename;

            const routeElement = document.createElement('div');
            routeElement.setAttribute('class', 'route-item');

            const deleteRelationShip = document.createElement('i');
            deleteRelationShip.setAttribute('class', 'fa-regular fa-trash-can  delete-route-button');

            deleteRelationShip.addEventListener('click', () => {
                components.genericModal.init(
                    this.container,
                    'Atenção',
                    'Você tem certeza que deseja deixar de ser caroneiro nesta rota?',
                    async () => {
                        const resp = await FacDriveRoutes.deleteRelationship('riderID', userConfig.iduser, item.idroute);
                        if (resp.status) {
                            components.alert.init('A carona foi deletada com sucesso!', 'success');
                            routeElement.remove();
                            return;
                        }
                        components.alert.init('Ocorreu um erro ao tentar deletar a sua carona!', 'error');
                    }
                )
            })

            const routeTitle = document.createElement('p');
            routeTitle.innerText = 'Nome da Rota';
            routeTitle.classList.add('route-title');

            const nameElement = document.createElement('h3');
            nameElement.innerText = routeName;
            nameElement.classList.add('route-name');

            const distanceElement = document.createElement('p');
            distanceElement.innerText = `Distância até o ponto: ${distance*1000} m`;
            distanceElement.classList.add('route-distance');

            const selectButton = document.createElement('button');
            selectButton.innerText = 'Ver ponto de espera';
            selectButton.classList.add('route-select-btn');

            selectButton.addEventListener('click', () => {
                utils.map.clearMap();
                components.darkBackground.exit('my-rides-screen-background');
                FacDriveFunctions.togglePrincipalMenuVisibility('show');
                utils.map.showRoute(coordinates);
                utils.map.createDestinationMarker(coordinates[0]);
                utils.map.createRidersMarker(coordinates[1], 'Você');
            });

            routeElement.append(deleteRelationShip, routeName, nameElement, distanceElement, selectButton);

            target.appendChild(routeElement);
        });
    }

    createExitButton() {
        return  components.button.createExitButton({
            id: 'exit-my-routes-screen',
            event: () => {
                components.darkBackground.exit('my-rides-screen-background');
                FacDriveFunctions.togglePrincipalMenuVisibility('show');
            }
        })
    }

}
