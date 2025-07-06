// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // בדיקה מוקדמת: אם יש פרמטרי אימות Supabase ב-URL
        const urlParams = new URLSearchParams(window.location.search);
        const hasSupabaseAuthParams = urlParams.has('type') || urlParams.has('token') || urlParams.has('token_hash');
        
        if (hasSupabaseAuthParams) {
            console.log('🔗 Supabase auth callback detected - minimal handling');
            
            // רק נקה את ה-URL ועצור - אל תטען כלום!
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.replaceState(null, '', cleanUrl);
            
            return; // עצור כאן לגמרי
        }
        
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
        
        // Check authentication if we didn't handle email confirmation
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
                    await EmailVerificationChecker.check(false); // false = from auth state change
                }
            } else if (event === 'SIGNED_OUT') {
                AppState.reset();
                NavigationUI.showAuthSection();
            }
        });
        
        console.log('✅ SharingNet App Initialized');
    } catch (error) {
        console.error('Error initializing app:', error);
        MessageManager.error('שגיאה בטעינת האפליקציה');
    }
}); 