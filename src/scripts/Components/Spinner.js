export class Spinner {
    init(container) {
        container.innerHTML = '';

        this.spinner = document.createElement('div');
        this.spinner.setAttribute('id', 'spinner');
        this.spinner.setAttribute('class', 'spinner');
        container.appendChild(this.spinner);
    }

    exit() {
        this.spinner.remove();
    }
}