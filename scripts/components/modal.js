export default class Modal {
    constructor() {
        this.modal = document.createElement('div');
        this.modal.id = 'modal';
        this.modal.className = 'hidden';
        this.modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        `;

        this.modalContent = document.createElement('div');
        this.modalContent.className = 'modal-content';
        this.modalContent.style.cssText = `
            background: #ffffff;
            padding: 20px;
            border-radius: 10px;
            width: 400px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            color: black; /* Default text color for the content */
            position: relative; /* Required for absolute positioning of close button */
        `;

        this.modalTitle = document.createElement('h2');
        this.modalTitle.style.color = 'black';
        this.modalMessage = document.createElement('p');
        this.modalMessage.style.color = 'black';
        this.modalActions = document.createElement('div');
        this.modalActions.style.cssText = 'margin-top: 20px;';

        this.modalClose = document.createElement('span');
        this.modalClose.innerHTML = '&times;';
        this.modalClose.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            cursor: pointer;
        `;
        this.modalClose.onclick = () => this.close();

        this.modalHtml = document.createElement('div'); // Keep this

        this.modalContent.appendChild(this.modalClose);
        this.modalContent.appendChild(this.modalTitle);
        this.modalContent.appendChild(this.modalMessage);
        this.modalContent.appendChild(this.modalHtml);
        this.modalContent.appendChild(this.modalActions);
        this.modal.appendChild(this.modalContent);
        document.body.appendChild(this.modal);
    }

    show({
             title = 'Modal Title',
             message = 'This is a modal message.',
             html, // Expect a DOM element
             confirmText,
             cancelText,
             onConfirm,
             onCancel,
         }) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;

        this.modalActions.innerHTML = '';

        if (confirmText) {
            const confirmButton = document.createElement('button');
            confirmButton.textContent = confirmText;
            confirmButton.style.cssText = `
                background-color: #4caf50;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin: 0 10px;
                cursor: pointer;
            `;
            confirmButton.onclick = () => {
                if (typeof onConfirm === 'function') onConfirm();
                this.close();
            };
            this.modalActions.appendChild(confirmButton);
        }

        if (cancelText) {
            const cancelButton = document.createElement('button');
            cancelButton.textContent = cancelText;
            cancelButton.style.cssText = `
                background-color: #f44336;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin: 0 10px;
                cursor: pointer;
            `;
            cancelButton.onclick = () => {
                if (typeof onCancel === 'function') onCancel();
                this.close();
            };
            this.modalActions.appendChild(cancelButton);
        }

        // Clear existing content
        while (this.modalHtml.firstChild) {
            this.modalHtml.removeChild(this.modalHtml.firstChild);
        }

        // Append the HTML element
        if (html) {
            this.modalHtml.appendChild(html); // Append the DOM element
        }

        this.modal.classList.remove('hidden');
        this.modal.style.cssText += `
            opacity: 1;
            pointer-events: auto;
        `;
    }

    close() {
        this.modal.style.cssText += `
            opacity: 0;
            pointer-events: none;
        `;
        setTimeout(() => this.modal.classList.add('hidden'), 300);
    }
}
