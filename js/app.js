// Main Application Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 SharingNet App Starting...');
    
    // Initialize cross-tab synchronization for email confirmation
    AppState.initCrossTabSync();
    
    // Initialize all UI components
    AuthTabsUI.init();
    UserLogin.init();
    UserRegistration.init();
    UserLogout.init();
    PostCreator.init();
    
    // Handle email confirmation callback first
    const handledEmailConfirmation = await EmailConfirmationHandler.handle();
    
    // Check authentication if we didn't handle email confirmation
    if (!handledEmailConfirmation) {
        await SessionChecker.check();
    }
    
    // Listen for authentication state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
            AppState.setCurrentUser(session.user);
            
            // Don't auto-navigate if we just handled email confirmation
            // Let the user manually log in instead
            if (!handledEmailConfirmation) {
                await EmailVerificationChecker.check(false); // false = from auth state change
            } else {
                console.log('🔗 Skipping auto-navigation after email confirmation - waiting for manual login');
            }
        } else if (event === 'SIGNED_OUT') {
            AppState.reset();
            NavigationUI.showAuthSection();
        }
    });
    
    console.log('✅ SharingNet App Initialized');
}); 