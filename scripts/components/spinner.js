import Toaster from "./toaster.js";

export default class Spinner {
    constructor(targetElement, containerId = 'spinner-container') {
        this.containerId = containerId;
        this.toast = new Toaster();
        this.targetElement =
            typeof targetElement === 'string'
                ? document.querySelector(targetElement)
                : targetElement;

        if (!this.targetElement) {
            this.toast.show(`Target element "${targetElement}" not found.  Spinner will not be attached.`, 'error');
            return;
        }

        this.container = this.createContainer();
        this.targetElement.appendChild(this.container);

        this.spinnerElement = this.createSpinnerElement();
        this.container.appendChild(this.spinnerElement);

        this.container.classList.add('spinner-container');
        this.hide();
    }

    createContainer() {
        const container = document.createElement('div');
        container.id = this.containerId;
        container.classList.add('spinner-container');
        return container;
    }

    createSpinnerElement() {
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        return spinner;
    }

    show() {
        this.container.classList.add('show');
    }

    hide() {
        this.container.classList.remove('show');
    }
}
