// Email Verification Guard
const EmailVerificationGuard = {
    async ensure() {
        // If user is not logged in, don't redirect to verification
        if (!AppState.currentUser) {
            MessageManager.warning('עליך להתחבר תחילה');
            NavigationUI.showAuthSection();
            return false;
        }
        
        if (!AppState.isEmailVerified) {
            // Check if we're already on verification section to avoid loops
            const verificationSection = document.getElementById('verificationSection');
            const isOnVerificationScreen = verificationSection && !verificationSection.classList.contains('hidden');
            
            if (!isOnVerificationScreen) {
                MessageManager.warning('עליך לאמת את המייל שלך לפני שתוכל לבצע פעולה זו');
                NavigationUI.showVerificationSection();
                
                // Set email for verification display if available
                const emailEl = document.getElementById('verificationEmail');
                if (emailEl && AppState.userProfile?.email) {
                    emailEl.textContent = AppState.userProfile.email;
                }
            }
            return false;
        }
        return true;
    }
}; 