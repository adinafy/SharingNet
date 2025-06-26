// Email Confirmation URL Handler
const EmailConfirmationHandler = {
    async handle() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        if (type === 'email_change' || type === 'signup') {
            console.log('🔗 Email confirmation detected - handling immediately');
            
            // Clean URL parameters
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            
            // Sign out to force fresh login
            await supabase.auth.signOut();
            AppState.reset();
            NavigationUI.showAuthSection();
            MessageManager.success('המייל אומת בהצלחה! 🎉 כעת התחבר שוב עם המייל והסיסמה שלך.');
            
            return true;
        }
        return false;
    }
}; 