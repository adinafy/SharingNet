// User Registration Handler - Creates user in auth.users and profiles
const UserRegistration = {
    async handle(e) {
        e.preventDefault();
        
        const nameInput = DOM.getRegisterName();
        const emailInput = DOM.getRegisterEmail();
        const passwordInput = DOM.getRegisterPassword();
        
        if (!nameInput || !emailInput || !passwordInput) {
            MessageManager.error('שדות הרשמה לא נמצאו');
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!name || !email || !password) {
            MessageManager.warning('אנא מלא את כל השדות');
            return;
        }

        if (password.length < 6) {
            MessageManager.warning('הסיסמה חייבת להכיל לפחות 6 תווים');
            return;
        }

        await LoadingManager.wrap(async () => {
            try {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });

                if (error) throw error;

                if (data.user && !data.session) {
                    // User needs to verify email
                    AppState.setCurrentUser(data.user);
                    NavigationUI.showVerificationSection();
                    MessageManager.success('נרשמת בהצלחה! נשלח אליך מייל אימות.');
                } else if (data.session) {
                    // User is immediately logged in (email confirmation disabled)
                    AppState.setCurrentUser(data.user);
                    await EmailVerificationChecker.check();
                    MessageManager.success('נרשמת בהצלחה!');
                }
            } catch (error) {
                console.error('Registration error:', error);
                MessageManager.error(error.message || 'שגיאה בהרשמה');
            }
        });
    },

    init() {
        if (DOM.registerForm) {
            DOM.registerForm.addEventListener('submit', (e) => this.handle(e));
        }
    }
}; 