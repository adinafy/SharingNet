// Email Resend Handler
const EmailResend = {
    async handle() {
        if (!AppState.currentUser?.email) {
            MessageManager.error('לא נמצא כתובת מייל למשתמש');
            return;
        }

        await LoadingManager.wrap(async () => {
            try {
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email: AppState.currentUser.email
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