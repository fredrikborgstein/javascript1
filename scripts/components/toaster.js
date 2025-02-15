export default class Toaster {
    constructor() {
        this.toastContainer = document.createElement("div");
        this.toastContainer.id = "toast-container";
        this.toastContainer.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.toastContainer);

        this.toastTypes = {
            success: {
                backgroundColor: "#28a745",
                color: "#ffffff",
            },
            warning: {
                backgroundColor: "#ffc107",
                color: "#212529",
            },
            error: {
                backgroundColor: "#dc3545",
                color: "#ffffff",
            },
            info: {
                backgroundColor: "#17a2b8",
                color: "#ffffff",
            },
        };
    }

    show(message, type = "info", duration = 3000) {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.textContent = message;

        const { backgroundColor, color } = this.toastTypes[type] || this.toastTypes.info;

        toast.style.cssText = `
            background-color: ${backgroundColor};
            color: ${color};
            padding: 20px 40px;
            border-radius: 5px;
            font-size: 1.2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transform: translateY(20px);
            animation: slide-in 0.5s forwards, fade-out 0.5s ${
            duration / 1000
        }s forwards;
        `;

        const keyframes = `
            @keyframes slide-in {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fade-out {
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.innerHTML = keyframes;
        document.head.appendChild(styleSheet);

        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
            styleSheet.remove();
        }, duration + 500);
    }
}
