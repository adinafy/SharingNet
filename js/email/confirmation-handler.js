// Email Confirmation URL Handler
const EmailConfirmationHandler = {
    async handle() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        console.log('🔗 EmailConfirmationHandler.handle() called');
        console.log('🔗 URL params:', window.location.search);
        console.log('🔗 Type parameter:', type);
        
        if (type === 'email_change' || type === 'signup') {
            console.log('🔗 Email confirmation detected - handling immediately');
            console.log('🔗 Type:', type);
            
            // Signal other tabs/windows that email confirmation occurred
            localStorage.setItem('sharingnet_email_confirmed', Date.now().toString());
            console.log('🔗 Set localStorage signal for other tabs');
            
            // Clean URL parameters
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            console.log('🔗 Cleaned URL parameters');
            
            // Sign out to force fresh login and clear any problematic state
            console.log('🔗 Signing out to clear state...');
            await supabase.auth.signOut();
            AppState.reset();
            console.log('🔗 Signed out and reset state');
            
            // Show auth section and switch to login tab
            NavigationUI.showAuthSection();
            console.log('🔗 Showing auth section');
            
            // Make sure we're on the login tab, not register tab
            if (DOM.loginTab && DOM.registerTab) {
                DOM.loginTab.classList.add('active');
                DOM.registerTab.classList.remove('active');
                DOM.loginForm.classList.remove('hidden');
                DOM.registerForm.classList.add('hidden');
                console.log('🔗 Switched to login tab');
            }
            
            MessageManager.success('המייל אומת בהצלחה! 🎉 כעת התחבר עם המייל והסיסמה שלך.');
            console.log('🔗 Email confirmation handling completed successfully');
            
            return true;
        } else {
            console.log('🔗 No email confirmation detected in URL');
            return false;
        }
    }
}; 