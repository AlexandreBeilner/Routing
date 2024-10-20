export class DarkBackground {

    create(container, element, elementID, tapToClose = false) {
        const background = document.createElement('div');
        background.setAttribute('class', 'dark-background');
        background.setAttribute('id', elementID);

        if (tapToClose) {
            background.addEventListener('click', () => {
                this.exit(elementID);
            });
        }
        background.appendChild(element);
        container.append(background);
    }

    exit(elementID) {
        document.getElementById(elementID)?.remove();
    }
}