// Loading State Management
const LoadingManager = {
    show() {
        if (DOM.loadingSpinner) {
            DOM.loadingSpinner.classList.remove('hidden');
        }
    },

    hide() {
        if (DOM.loadingSpinner) {
            DOM.loadingSpinner.classList.add('hidden');
        }
    },

    // Helper for async operations
    async wrap(asyncFunction) {
        this.show();
        try {
            return await asyncFunction();
        } finally {
            this.hide();
        }
    }
}; 