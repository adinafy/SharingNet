async function initializeSupabaseComponents() {
    console.log('🚀 SharingNet App Starting...');
    
    // Initialize cross-tab synchronization for email confirmation
    AppState.initCrossTabSync();
    
    // Initialize UI components
    AuthTabsUI.init();
    
    // Initialize auth handlers
    UserLogin.init();
    UserLogout.init();
    UserRegistration.init();
    
    // Handle email confirmation callback first
    const handledEmailConfirmation = await EmailConfirmationHandler.handle();

    if (!handledEmailConfirmation) {
        await SessionChecker.check();
    }
    
    // Listen for authentication state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔄 Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
            AppState.setCurrentUser(session.user);
            
            // Don't auto-navigate after email confirmation
            if (!handledEmailConfirmation) {
                await EmailVerificationChecker.check(false);
            } else {
                // ✅ הוסף כאן - כתוב ל-localStorage לסנכרון בין טאבים
                await EmailVerificationChecker.check(false);
                
                if (AppState.isEmailVerified) {
                    // Signal other tabs about successful email confirmation
                    localStorage.setItem('sharingnet_email_confirmed', Date.now().toString());
                    console.log('🔄 Email confirmation signaled to other tabs');
                }
            }
        } else if (event === 'SIGNED_OUT') {
            AppState.reset();
            NavigationUI.showAuthSection();
        }
    });
    
    return true; // ✅ החזר true
} 