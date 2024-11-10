import {components} from "../../Globals";

export class GenericModal {
    constructor() {
        this.modal = null;
        this.title = '';
        this.message = '';
        this.onConfirm = null;
        this.onCancel = null;
        this.container = null;
    }

    init(container, title, message, onConfirm, input = {}) {
        this.title = title;
        this.message = message;
        this.onConfirm = onConfirm;
        this.container = container;
        this.input = input;

        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.classList.add('modal');

        this.createHeader();
        this.createBody();
        this.createButtons();

        components.darkBackground.create(this.container, this.modal, 'generic-modal-background',true);
    }

    createHeader() {
        const header = document.createElement('div');
        header.classList.add('modal-header');

        const titleElement = document.createElement('span');
        titleElement.textContent = this.title;
        header.appendChild(titleElement);

        this.modal.appendChild(header);
    }

    createBody() {
        const body = document.createElement('div');
        body.classList.add('modal-body');

        const messageElement = document.createElement('p');
        messageElement.textContent = this.message;
        body.appendChild(messageElement);

        if (Object.keys(this.input).length > 0) {
            const input = document.createElement('input');
            input.setAttribute('class', 'modal-input')
            Object.keys(this.input).forEach(key => {
                input.setAttribute(key, this.input[key]);
            })
            body.appendChild(input);
        }

        this.modal.appendChild(body);
    }

    createButtons() {
        const footer = document.createElement('div');
        footer.classList.add('modal-footer');

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.addEventListener('click', () => {
            components.darkBackground.exit('generic-modal-background');
        });
        footer.appendChild(cancelButton);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        confirmButton.addEventListener('click', async () => {
            if (Object.keys(this.input).length > 0 && ! document.querySelector(`#${this.input.id}`)?.value) {
                components.alert.init('Preencha o campo de texto', 'error');
                return;
            }
            await this.onConfirm();
            components.darkBackground.exit('generic-modal-background');
        });
        footer.appendChild(confirmButton);

        this.modal.appendChild(footer);
    }
}
