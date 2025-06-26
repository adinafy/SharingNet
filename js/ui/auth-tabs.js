// Authentication Tab Management
const AuthTabsUI = {
    init() {
        if (DOM.loginTab && DOM.registerTab) {
            DOM.loginTab.addEventListener('click', () => this.showLogin());
            DOM.registerTab.addEventListener('click', () => this.showRegister());
        }
    },

    showLogin() {
        DOM.loginTab.classList.add('active');
        DOM.registerTab.classList.remove('active');
        DOM.loginForm.classList.remove('hidden');
        DOM.registerForm.classList.add('hidden');
    },

    showRegister() {
        DOM.registerTab.classList.add('active');
        DOM.loginTab.classList.remove('active');
        DOM.registerForm.classList.remove('hidden');
        DOM.loginForm.classList.add('hidden');
    }
}; 