// Session Validation
const SessionChecker = {
    async check() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Session check error:', error);
                NavigationUI.showAuthSection();
                return;
            }
            
            if (session && session.user) {
                AppState.setCurrentUser(session.user);
                await EmailVerificationChecker.check(false); // false = from session check
            } else {
                NavigationUI.showAuthSection();
            }
        } catch (error) {
            console.error('Session check failed:', error);
            NavigationUI.showAuthSection();
        }
    }
}; 