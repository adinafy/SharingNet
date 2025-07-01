// Message Display System
const MessageManager = {
    show(message, type = 'error') {
        // Remove existing messages of the same type to avoid spam
        const existingMessages = document.querySelectorAll(`.${type}-message`);
        existingMessages.forEach(msg => msg.remove());
        
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}-message`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            max-width: 400px;
            background: ${this.getBackgroundColor(type)};
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            animation: slideInFromRight 0.3s ease-out;
        `;
        
        // Add close button for important messages
        if (type === 'info' || type === 'warning') {
            const closeBtn = document.createElement('span');
            closeBtn.innerHTML = ' ×';
            closeBtn.style.cssText = `
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                margin-left: 10px;
                opacity: 0.8;
            `;
            closeBtn.onclick = () => messageEl.remove();
            messageEl.appendChild(closeBtn);
        }
        
        document.body.appendChild(messageEl);
        
        // Auto remove after delay (longer for important messages)
        const delay = (type === 'error' || type === 'warning') ? 8000 : 5000;
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.opacity = '0';
                messageEl.style.transform = 'translateX(100%)';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, delay);
    },

    getBackgroundColor(type) {
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };
        return colors[type] || colors.error;
    },

    success(message) {
        this.show(message, 'success');
    },

    error(message) {
        this.show(message, 'error');
    },

    warning(message) {
        this.show(message, 'warning');
    },

    info(message) {
        this.show(message, 'info');
    }
}; 