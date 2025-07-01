// Email Confirmation URL Handler
const EmailConfirmationHandler = {
    async handle() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        if (type === 'email_change' || type === 'signup') {
            console.log('🔗 Email confirmation detected - handling immediately');
            
            // Signal other tabs/windows that email confirmation occurred
            localStorage.setItem('sharingnet_email_confirmed', Date.now().toString());
            
            // Clean URL parameters
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            // Sign out to force fresh login and clear any problematic state
            await supabase.auth.signOut();
            AppState.reset();
            
            // Show auth section and switch to login tab
            NavigationUI.showAuthSection();
            
            // Make sure we're on the login tab, not register tab
            if (DOM.loginTab && DOM.registerTab) {
                DOM.loginTab.classList.add('active');
                DOM.registerTab.classList.remove('active');
                DOM.loginForm.classList.remove('hidden');
                DOM.registerForm.classList.add('hidden');
            }
            
            MessageManager.success('המייל אומת בהצלחה! 🎉 כעת התחבר עם המייל והסיסמה שלך.');
            
            return true;
        }
        return false;
    }
}; 