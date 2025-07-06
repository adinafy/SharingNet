// Email Confirmation URL Handler
const EmailConfirmationHandler = {
    async handle() {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type');
        
        console.log('🔗 EmailConfirmationHandler.handle() called');
        console.log('🔗 URL params:', window.location.search);
        console.log('🔗 Type parameter:', type);
        
        try {
            // מקרה 1: אימות מייל - לא מעלים שום מסך, רק מנקים URL
            if (type === 'email') {
                console.log('🔗 Email verification link detected');
                
                // Clean URL parameters
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState(null, '', cleanUrl);
                
                // אימות המייל כבר התבצע ע"י Supabase
                // לא מעלים שום מסך או הודעה
                console.log('🔗 Email verification handled silently');
                
                return true;
            }
            
            // מקרה 2: שחזור סיסמה - מציגים מסך החלפת סיסמה
            else if (type === 'recovery') {
                console.log('🔗 Password recovery link detected');
                
                // Clean URL parameters
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState(null, '', cleanUrl);
                
                // מתנתקים מהמערכת ומנקים את המצב
                await AppState.logout();
                
                // הצגת מסך התחברות עם הודעה על שחזור סיסמה
                AppState.showMessage('אנא הכנס את הסיסמה החדשה שלך');
                AppState.showLoginScreen();
                
                return true;
            }
            
            // מקרה 3: הזמנת משתמש - מציגים מסך הרשמה/התחברות
            else if (type === 'invite') {
                console.log('🔗 User invite link detected');
                
                // Clean URL parameters
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState(null, '', cleanUrl);
                
                // מתנתקים מהמערכת ומנקים את המצב
                await AppState.logout();
                
                // הצגת מסך הרשמה עם הודעה
                AppState.showMessage('הוזמנת להצטרף! אנא השלם את ההרשמה.');
                AppState.showLoginScreen();
                
                return true;
            }
            
            // מקרה 4: שינוי מייל - מעדכנים את המייל
            else if (type === 'email_change') {
                console.log('🔗 Email change confirmation detected');
                
                // Clean URL parameters
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState(null, '', cleanUrl);
                
                AppState.showSuccessMessage('כתובת המייל עודכנה בהצלחה!');
                await SessionChecker.check();
                
                return true;
            }
            
            console.log('🔗 No email confirmation type detected');
            return false;
            
        } catch (error) {
            console.error('🔗 Error in EmailConfirmationHandler:', error);
            AppState.showErrorMessage('שגיאה בטיפול בקישור האימות');
            return false;
        }
    }
}; 