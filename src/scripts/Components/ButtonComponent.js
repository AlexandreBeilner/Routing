export class ButtonComponent {

    circleButton(options) {
        const button = document.createElement('div');
        button.setAttribute('id', 'circle-button');
        button.setAttribute('class', options.class);
        button.addEventListener('click', options.event);
        const icon = document.createElement('i');
        icon.setAttribute('class', options.icon);

        button.append(icon);
        return button;
    }

    genericButton(options) {
        const button = document.createElement('div');
        button.setAttribute('id', 'generic-button');
        button.setAttribute('class', options.class);
        button.addEventListener('click', options.event);

        const buttonLabel = document.createElement('span');
        buttonLabel.innerHTML = options.label;

        const icon = document.createElement('i');
        icon.setAttribute('class', options.icon);

        button.append(buttonLabel, icon);
        return button;
    }

    createExitButton(options) {
        const button = document.createElement('div');
        button.setAttribute('id', options.id);
        button.setAttribute('class', 'exit-screen-button');
        button.addEventListener('click', options.event);

        const icon = document.createElement('i');
        icon.setAttribute('class', 'fa-solid fa-x');

        button.appendChild(icon);
        return button;
    }

    createCircleButtonWithLabel(options) {
        const container = document.createElement('div');
        container.setAttribute('class', 'circle-button-with-label');

        const button = document.createElement('div');
        button.setAttribute('class', 'circle-button-with-icon')
        button.classList.add(options.color ?? 'blue')

        button.addEventListener('click', options.event)

        const icon = document.createElement('i');
        icon.setAttribute('class', options.icon)

        const label = document.createElement('span');
        label.innerText = options.label;

        button.appendChild(icon);
        container.append(button, label)

        return container;
    }
}
