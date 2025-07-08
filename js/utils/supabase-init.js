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
        console.log('📧 Session data:', session ? {
            user_id: session.user?.id,
            email: session.user?.email,
            email_confirmed_at: session.user?.email_confirmed_at,
            user_metadata: session.user?.user_metadata
        } : 'No session');
        console.log('🎯 handledEmailConfirmation flag:', handledEmailConfirmation);
        
        if (event === 'SIGNED_IN' && session) {
            console.log('✅ SIGNED_IN event detected - processing...');
            AppState.setCurrentUser(session.user);
            
            // Don't auto-navigate after email confirmation
            if (!handledEmailConfirmation) {
                console.log('🔍 Running EmailVerificationChecker (not from email confirmation)');
                await EmailVerificationChecker.check(false);
            } else {
                console.log('🔍 Running EmailVerificationChecker (from email confirmation)');
                await EmailVerificationChecker.check(false);
                
                console.log('📊 Current AppState.isEmailVerified:', AppState.isEmailVerified);
                if (AppState.isEmailVerified) {
                    console.log('🎉 Setting localStorage - email verified!');
                    localStorage.setItem('sharingnet_email_confirmed', Date.now().toString());
                    console.log('🔄 Email confirmation signaled to other tabs');
                } else {
                    console.log('⚠️ Email not yet verified according to AppState');
                }
            }
        } else if (event === 'SIGNED_OUT') {
            console.log('🚪 SIGNED_OUT event detected');
            AppState.reset();
            NavigationUI.showAuthSection();
        } else {
            console.log('🔍 Other auth event:', event, 'Session exists:', !!session);
        }
    });
    
    return true; // ✅ החזר true
} 