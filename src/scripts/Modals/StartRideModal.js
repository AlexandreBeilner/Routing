import {components} from "../../Globals";

export class StartRideModal {
    init(container, riders, event) {
        const modalContainer = document.createElement('div');
        modalContainer.setAttribute('class', 'start-ride-modal');

        const header = this.createHeader();

        const ridersContainer = this.createRidesContainer(riders);
        const startButton = this.createStartButton(event);

        modalContainer.append(header, ridersContainer, startButton);

        components.darkBackground.create(container, modalContainer, 'dark-background-start-ride-modal', true);
    }

    createHeader() {
        const exitButton = this.createExitButton();
        const header = document.createElement('div');
        header.setAttribute('class', 'header-start-rider-modal');
        const title = document.createElement('span');
        title.setAttribute('class', 'modal-start-ride-title')
        title.innerHTML = 'Iniciando corrida';

        const message = document.createElement('span');
        message.setAttribute('class', 'modal-start-ride-message');
        message.innerHTML = 'Abaixo estão os seus caroneiros! Ao iniciar a corrida eles serão notificados e estarão esperando por você! Para prosseguir aperte em começar.';

        header.append(exitButton, title, message);
        return header
    }

    createExitButton() {
        return components.button.createExitButton({
            id: 'exit-start-ride-modal',
            event: () => {
                components.darkBackground.exit('dark-background-start-ride-modal');
            }
        });
    }

    createRidesContainer(riders) {
        const container = document.createElement('div');
        container.setAttribute('class', 'riders-container');

        riders.forEach(item => {
            const element = document.createElement('div');
            element.setAttribute('class', 'rider-element');
            const elementImage = document.createElement('img');
            const elementName = document.createElement('span');
            const elementPhone = document.createElement('span');

            elementName.innerHTML = "Nome: " + item.ridername ?? '' + ' ' + item.ridersurname ?? '';
            elementPhone.innerHTML = "Telefone: " + item.riderphone || 'Não cadastrado';
            elementImage.src = item.riderimage === 'null' || !item.riderimage ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqjHyLaaUPOqbkYNiYHd7j5402wQluQDeHQg&s' : item.riderimage;

            const textContainer = document.createElement('div');
            textContainer.setAttribute('class', 'text-container-rider-element');
            textContainer.append(elementName, elementPhone);

            element.append(elementImage, textContainer);
            container.append(element);
        })

        return container;
    }

    createStartButton(event) {
        return components.button.genericButton({
            icon: 'fa-solid fa-car-rear',
            class: 'large-button height-50 green',
            label: 'Começar',
            event: async () => {
                event()
            }
        });
    }
}