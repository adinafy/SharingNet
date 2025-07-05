// Login Handler
const LoginHandler = {
    async handleLogin(event) {
        event.preventDefault();
        
        const email = DOM.loginEmail.value;
        const password = DOM.loginPassword.value;
        
        if (!email || !password) {
            MessageManager.error('נא למלא את כל השדות');
            return;
        }

        try {
            LoadingManager.show();
            
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
            
            // Check email verification status
            await EmailVerificationChecker.check(true);
            
            // If email is verified, proceed to main app
            if (AppState.isEmailVerified) {
                NavigationUI.showMainApp();
                await PostLoader.load();
                MessageManager.success('ברוכים הבאים! התחברת בהצלחה.');
            } else {
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
        } finally {
            LoadingManager.hide();
        }
    }
}; 