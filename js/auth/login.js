// User Login Handler
const UserLogin = {
    async handle(event) {
        event.preventDefault();
        
        const emailInput = DOM.getLoginEmail();
        const passwordInput = DOM.getLoginPassword();
        
        if (!emailInput || !passwordInput) {
            MessageManager.error('שדות התחברות לא נמצאו');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email || !password) {
            MessageManager.error('נא למלא את כל השדות');
            return;
        }

        await LoadingManager.wrap(async () => {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    console.error('Login error:', error);
                    MessageManager.error('שגיאה בהתחברות. בדוק את הפרטים ונסה שוב.');
                    return;
                }

                if (!data.user) {
                    MessageManager.error('לא נמצא משתמש');
                    return;
                }

                // Set current user in state
                AppState.setCurrentUser(data.user);

                // 🔍 DEBUG: Check auth user data
                console.log('🔍 Login Debug - Auth User Data:');
                console.log('  - User ID:', data.user.id);
                console.log('  - Email:', data.user.email);
                console.log('  - email_confirmed_at:', data.user.email_confirmed_at);
                console.log('  - Raw user object:', data.user);

                // Check email verification status
                console.log('🔍 Running EmailVerificationChecker...');
                await EmailVerificationChecker.check(true);

                console.log('🔍 After verification check:');
                console.log('  - AppState.userProfile:', AppState.userProfile);
                console.log('  - AppState.isEmailVerified:', AppState.isEmailVerified);

                // If email is verified, proceed to main app
                if (AppState.isEmailVerified) {
                    console.log('✅ Email verified - showing main app');
                    NavigationUI.showMainApp();
                    await PostLoader.load();
                    MessageManager.success('ברוכים הבאים! התחברת בהצלחה.');
                } else {
                    console.log('❌ Email not verified - showing verification section');
                    // Show verification section if email not verified
                    NavigationUI.showVerificationSection();
                    const emailEl = document.getElementById('verificationEmail');
                    if (emailEl) {
                        emailEl.textContent = email;
                    }
                    MessageManager.warning('עליך לאמת את המייל שלך לפני הכניסה למערכת. בדוק את תיבת הדואר שלך.');
                }
            } catch (error) {
                console.error('Login error:', error);
                MessageManager.error('שגיאה בהתחברות. נסה שוב מאוחר יותר.');
            }
        });
    },

    init() {
        if (DOM.loginForm) {
            DOM.loginForm.addEventListener('submit', (e) => this.handle(e));
        }
    }
}; 