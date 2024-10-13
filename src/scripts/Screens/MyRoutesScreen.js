import {components, userConfig} from "../../Globals";
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
        const footer = this.createFooter();

        this.screen.appendChild(header);
        this.screen.appendChild(body);
        this.screen.appendChild(footer);


        components.darkBackground.create(this.container, this.screen);
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
            body.innerHTML = 'Você não possui nenhuma rota cadastrada! Para cadastrar aperte no botão "Criar rota" ou em "Melhor caminho" no menu inicial.'

            if (resp.response.length === 0) {
                body.innerHTML = 'Você não possui nenhuma rota cadastrada! Para cadastrar aperte no botão "Criar rota" ou em "Melhor caminho" no menu inicial.'
                return;
            }
            console.log(resp);
        })

        return body;
    }

    createFooter() {
        const footer = document.createElement('div');
        footer.setAttribute('id', 'my-routes-footer');

        const selectRouteButton = this.createSelectRouteButton();
        footer.appendChild(selectRouteButton);
        return footer;
    }

    createExitButton() {
        return  components.button.createExitButton({
            id: 'exit-my-routes-screen',
            event: () => {
                components.darkBackground.exit();
            }
        })
    }

    createSelectRouteButton() {
        const button = document.createElement('div');
        button.setAttribute('id', 'select-route-button');
        button.addEventListener('click', () => this._selectRoute());

        const label = document.createElement('span');
        label.innerHTML = 'Selecionar está rota'
        button.appendChild(label);
        return button;
    }

    _selectRoute() {
        console.log('calabreso')
    }

}
