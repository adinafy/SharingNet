// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize UI components
        AuthTabsUI.init();
        
        // Initialize auth handlers
        UserLogin.init();
        UserLogout.init();
        UserRegistration.init();
        
        // Check initial session
        await SessionChecker.check();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        MessageManager.error('שגיאה בטעינת האפליקציה');
    }
}); 