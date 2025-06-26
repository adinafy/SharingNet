// Email Verification Guard
const EmailVerificationGuard = {
    async ensure() {
        if (!AppState.isEmailVerified) {
            MessageManager.warning('עליך לאמת את המייל שלך לפני שתוכל לבצע פעולה זו');
            NavigationUI.showVerificationSection();
            return false;
        }
        return true;
    }
}; 