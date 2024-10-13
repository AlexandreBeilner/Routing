export class TipComponent {
    init(options) {
        const container = document.createElement('div');
        container.setAttribute('class', 'tip-component');
        const icon = document.createElement('i');
        icon.setAttribute('class', 'fa-solid fa-circle-info');

        const text = document.createElement('span');
        text.innerText = options.text;
        container.append(icon, text);
        return container;
    }
}