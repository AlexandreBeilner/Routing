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

    init(container, title, message, onConfirm) {
        this.title = title;
        this.message = message;
        this.onConfirm = onConfirm;
        this.container = container;

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
            await this.onConfirm();
            components.darkBackground.exit('generic-modal-background');
        });
        footer.appendChild(confirmButton);

        this.modal.appendChild(footer);
    }
}
