// User Logout Handler
const UserLogout = {
    async handle() {
        await LoadingManager.wrap(async () => {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;

                AppState.reset();
                NavigationUI.showAuthSection();
                this.clearForms();
                MessageManager.success('התנתקת בהצלחה!');
            } catch (error) {
                console.error('Logout error:', error);
                MessageManager.error(error.message || 'שגיאה בהתנתקות');
            }
        });
    },

    clearForms() {
        const emailInput = DOM.getLoginEmail();
        const passwordInput = DOM.getLoginPassword();
        
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
    },

    init() {
        if (DOM.logoutBtn) {
            DOM.logoutBtn.addEventListener('click', () => this.handle());
        }
    }
}; 