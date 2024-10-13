export class DarkBackground {
    create(container, element, tapToClose = false) {
        this.background = document.createElement('div');
        this.background.setAttribute('id', 'dark-background');

        if (tapToClose) {
            this.background.addEventListener('click', () => {
                this.exit();
            });
        }
        this.background.appendChild(element);
        container.append(this.background);
    }

    exit() {
        this.background.remove();
    }
}