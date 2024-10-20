import {components, userConfig, utils} from "../../Globals";
import {FacDriveRoutes} from "../routes/FacDriveRoutes";

export class MyRoutesScreen {
    constructor(container) {
        this.container = container;
        this.screen = null;
        this.darkBackground = null;
    }

    init() {
        this.screen = document.createElement('div');
        this.screen.setAttribute('id', 'my-routes-screen');
        this.screen.setAttribute('class', 'default-screen-style');

        const header = this.createHeader();
        const body = this.createBody();

        this.screen.appendChild(header);
        this.screen.appendChild(body);

        components.darkBackground.create(this.container, this.screen, 'my-routes-screen-background');
    }

    createHeader() {
        const header = document.createElement('div');
        header.setAttribute('id', 'my-routes-header');

        const label = document.createElement('span');
        label.innerHTML = 'Minhas rotas';

        const exitButton = this.createExitButton();

        header.append(label, exitButton);
        return header;
    }

    createBody() {
        const body = document.createElement('div');
        body.setAttribute('id', 'my-routes-body');
        components.spinner.init(body);

        FacDriveRoutes.getUserRoutes(userConfig.iduser).then((resp) => {
            components.spinner.exit();
            if (resp.response.length === 0) {
                body.innerHTML = 'Você não possui nenhuma rota cadastrada! Para cadastrar aperte no botão "Criar rota" ou em "Melhor caminho" no menu inicial.'
                return;
            }
            this.createRoutesElement(resp.response, body);
        })

        return body;
    }

    createRoutesElement(data, target) {
        data.forEach(item => {
            const latLngArray = utils.map.formatCoordinateArrayToGoogleAPI(item.routePoints ?? []);
            const distance = utils.map.calculateCoordinatesDistance(latLngArray);
            const routeName = item.routename;

            const routeElement = document.createElement('div');
            routeElement.setAttribute('class', 'route-item');

            const deleteRouteButton = document.createElement('i');
            deleteRouteButton.setAttribute('class', 'fa-regular fa-trash-can  delete-route-button');

            deleteRouteButton.addEventListener('click', () => {
                components.genericModal.init(
                    this.container,
                    'Atenção',
                    'Você tem certeza que deseja deletar essa rota. A Não terá como voltar atrás com essa ação.',
                    async () => {
                        const resp = await FacDriveRoutes.deleteRoute(item.idroute);
                        if (resp.status) {
                            components.alert.init('A sua rota foi deletada com sucesso!', 'success');
                            routeElement.remove();
                            return;
                        }
                        components.alert.init('Ocorreu um erro ao tentar deletar a sua rota!', 'error');
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
            distanceElement.innerText = `Distância: ${distance} km`;
            distanceElement.classList.add('route-distance');

            const selectButton = document.createElement('button');
            selectButton.innerText = 'Ver caminho';
            selectButton.classList.add('route-select-btn');
            selectButton.addEventListener('click', () => {
                utils.map.createOriginMarker(latLngArray[0])
                utils.map.createDestinationMarker(latLngArray[latLngArray.length - 1]);
                utils.map.showRoute(latLngArray);
                components.darkBackground.exit('my-routes-screen-background');
            });

            routeElement.appendChild(deleteRouteButton);
            routeElement.appendChild(routeTitle);
            routeElement.appendChild(nameElement);
            routeElement.appendChild(distanceElement);
            routeElement.appendChild(selectButton);

            target.appendChild(routeElement);
        });
    }

    createExitButton() {
        return  components.button.createExitButton({
            id: 'exit-my-routes-screen',
            event: () => {
                components.darkBackground.exit('my-routes-screen-background');
            }
        })
    }

    _selectRoute() {
        console.log('calabreso')
    }

}
