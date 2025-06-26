// UI Navigation Management
const NavigationUI = {
    showAuthSection() {
        DOM.authSection.classList.remove('hidden');
        DOM.mainApp.classList.add('hidden');
        if (DOM.verificationSection) {
            DOM.verificationSection.classList.add('hidden');
        }
        DOM.userMenu.classList.add('hidden');
    },

    showMainApp() {
        DOM.authSection.classList.add('hidden');
        DOM.mainApp.classList.remove('hidden');
        if (DOM.verificationSection) {
            DOM.verificationSection.classList.add('hidden');
        }
        DOM.userMenu.classList.remove('hidden');
        
        // Update user display name from profiles table
        DOM.userDisplayName.textContent = AppState.getUserDisplayName();
    },

    showVerificationSection() {
        DOM.authSection.classList.add('hidden');
        DOM.mainApp.classList.add('hidden');
        
        if (!DOM.verificationSection) {
            VerificationUI.create();
        }
        
        DOM.verificationSection.classList.remove('hidden');
        DOM.userMenu.classList.add('hidden');
        
        // Update verification email display
        const emailEl = document.getElementById('verificationEmail');
        if (emailEl && AppState.currentUser) {
            emailEl.textContent = AppState.currentUser.email;
        }
    }
}; 