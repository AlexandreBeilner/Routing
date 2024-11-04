export class Alert {
    constructor(container) {
        this.container = container;
    }

    init(message, type) {
        const alert = document.createElement('div');
        alert.setAttribute('class', 'toast-alert');
        alert.classList.add(type);

        const iconName = {
            error: 'fa-solid fa-triangle-exclamation',
            success: 'fa-solid fa-circle-check',
            alert: 'fa-solid fa-circle-exclamation'
        };

        const icon = document.createElement('i');
        icon.setAttribute('class', iconName[type]);

        const alertMessage = document.createElement('span');
        alertMessage.innerText = message;

        const progressBar = document.createElement('div');
        progressBar.setAttribute('class', 'progress-bar');

        alert.append(icon, alertMessage, progressBar);
        this.container.appendChild(alert);

        const duration = 8000;

        progressBar.style.transition = `width ${duration}ms linear`;
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 10);

        setTimeout(() => {
            alert.remove();
        }, duration);
    }
}