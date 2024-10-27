export class DarkBackground {

    create(container, element, elementID, tapToClose = false) {
        const background = document.createElement('div');
        background.setAttribute('class', 'dark-background');
        background.setAttribute('id', elementID);

        if (tapToClose) {
            background.addEventListener('click', (e) => {
                if(e.target === background) {
                    this.exit(elementID);
                }
            });
        }
        background.appendChild(element);
        container.append(background);
    }

    toggleVisibility(elementID) {
        document.getElementById(elementID)?.classList.toggle('hide-background');
    }

    exit(elementID) {
        document.getElementById(elementID)?.remove();
    }
}