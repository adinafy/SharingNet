// User Login Handler - Uses Supabase auth
const UserLogin = {
    async handle(e) {
        e.preventDefault();
        
        const emailInput = DOM.getLoginEmail();
        const passwordInput = DOM.getLoginPassword();
        
        if (!emailInput || !passwordInput) {
            MessageManager.error('שדות התחברות לא נמצאו');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            MessageManager.warning('אנא מלא את כל השדות');
            return;
        }

        await LoadingManager.wrap(async () => {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) throw error;

                AppState.setCurrentUser(data.user);
                
                // Check verification status - but don't force to verification if already verified
                await EmailVerificationChecker.checkAfterLogin();
                
            } catch (error) {
                console.error('Login error:', error);
                MessageManager.error(error.message || 'שגיאה בהתחברות');
            }
        });
    },

    init() {
        if (DOM.loginForm) {
            DOM.loginForm.addEventListener('submit', (e) => this.handle(e));
        }
    }
}; 