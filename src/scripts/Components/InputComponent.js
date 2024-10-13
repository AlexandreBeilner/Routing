import {components} from "../../Globals";

export class  InputComponent {
    createSearchBox(container) {
        const searchBox = document.createElement('input');
        searchBox.setAttribute('id', 'pac-input');
        searchBox.setAttribute('class', 'controls');
        searchBox.setAttribute('type', 'text');
        searchBox.setAttribute('placeholder', 'Pesquisar...');

        container.appendChild(searchBox);
    }

    createInput(options) {
        const container = document.createElement('div');
        container.setAttribute('id', 'input-container');

        const label = document.createElement('label');
        label.textContent = options.label;

        const input = document.createElement('input');
        Object.keys(options.input).forEach(key => {
            input.setAttribute(key, options.input[key]);
        });

        input.addEventListener('input', function () {
            if (options.numeric) input.value = input.value.replace(/[^0-9]/g, '');
        });

        container.appendChild(label);
        container.appendChild(input);

        if (options.tip) {
            const tip = components.tip.init({ text: options.tip });
            container.appendChild(tip);
        }

        return container;
    }
}
