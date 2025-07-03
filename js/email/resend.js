// Email Resend Handler
const EmailResend = {
    async handle() {
        // Get email from verification display instead of AppState (since we signed out)
        const emailEl = document.getElementById('verificationEmail');
        const email = emailEl?.textContent;
        
        if (!email) {
            MessageManager.error('לא נמצא כתובת מייל למשתמש');
            return;
        }

        await LoadingManager.wrap(async () => {
            try {
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: email
                });

                if (error) throw error;

                MessageManager.success('מייל האימות נשלח חוזר! אנא בדוק את תיבת הדואר שלך.');
            } catch (error) {
                console.error('Resend email error:', error);
                MessageManager.error('שגיאה בשליחת מייל: ' + (error.message || 'שגיאה לא ידועה'));
            }
        });
    }
}; 