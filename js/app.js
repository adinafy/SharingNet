// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize UI components
        NavigationUI.init();
        AuthTabsUI.init();
        
        // Initialize auth handlers
        if (DOM.loginForm) {
            DOM.loginForm.addEventListener('submit', (e) => LoginHandler.handleLogin(e));
        }
        
        // Initialize other handlers
        LogoutHandler.init();
        RegisterHandler.init();
        EmailResendHandler.init();
        
        // Check initial session
        await SessionChecker.check();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        MessageManager.error('שגיאה בטעינת האפליקציה');
    }
}); 