// ייבוא הגדרות Supabase
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

// אתחול משתנים עם ערכים ריקים - למניעת בעיות timing
let supabase = null;
let registerForm = null;
let messageDiv = null;

// טעינת ספריית Supabase
async function loadSupabase() {
    try {
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase נטען בהצלחה');
    } catch (error) {
        console.error('שגיאה בטעינת Supabase:', error);
        showMessage('שגיאה בטעינת המערכת', 'error');
    }
}

// התחלת האפליקציה
document.addEventListener('DOMContentLoaded', async () => {
    // עדכון המשתנים עם האלמנטים הקיימים
    registerForm = document.getElementById('registerForm');
    messageDiv = document.getElementById('message');
    
    // טעינת Supabase
    await loadSupabase();
    
    // הוספת מאזיני אירועים
    initializeEventListeners();
    
    // בדיקת סטטוס אימות
    checkAuthStatus();
});

// הוספת מאזיני אירועים
function initializeEventListeners() {
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

// טיפול בהרשמה
async function handleRegister(event) {
    event.preventDefault();
    
    // ניקוי הודעות קודמות
    hideMessage();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // בדיקת התאמת סיסמאות
    if (password !== confirmPassword) {
        showMessage('הסיסמאות אינן תואמות', 'error');
        return;
    }

    // בדיקת אורך סיסמה
    if (password.length < 6) {
        showMessage('הסיסמה חייבת להכיל לפחות 6 תווים', 'error');
        return;
    }

    // הפעלת מצב טעינה
    setLoadingState(true);

    try {
        // הרשמה ב-Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (authError) {
            throw authError;
        }

        // אם ההרשמה הצליחה, הוספת המשתמש לטבלת users
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('users')
                .insert([
                    {
                        id: authData.user.id,
                        username: username,
                        email: email
                    }
                ]);

            if (profileError) {
                console.error('שגיאה ביצירת פרופיל:', profileError);
                // גם אם יש שגיאה בפרופיל, ההרשמה עדיין הצליחה
            }
        }

        showMessage('הרשמה הצליחה! בדוק את האימייל שלך לאימות החשבון', 'success');
        
        // מעבר לדף התחברות לאחר 3 שניות
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);

    } catch (error) {
        console.error('שגיאה בהרשמה:', error);
        const errorMsg = getErrorMessage(error);
        showMessage(errorMsg, 'error');
        
        // אם השגיאה מרמזת שהמשתמש כבר רשום, נוסיף הנחיה
        if (errorMsg.includes('כבר רשום') || errorMsg.includes('נסה להתחבר')) {
            setTimeout(() => {
                const currentMsg = messageDiv.textContent;
                messageDiv.innerHTML = currentMsg + '<br><a href="login.html" style="color: #721c24; text-decoration: underline;">לחץ כאן להתחברות</a>';
            }, 100);
        }
    } finally {
        setLoadingState(false);
    }
}

// בדיקת סטטוס אימות
async function checkAuthStatus() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            // המשתמש מחובר - מעבר לדשבורד
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('שגיאה בבדיקת סטטוס אימות:', error);
    }
}

// הצגת הודעות למשתמש
function showMessage(text, type = 'info') {
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }
}

// הסתרת הודעות
function hideMessage() {
    if (messageDiv) {
        messageDiv.style.display = 'none';
        messageDiv.className = 'message';
    }
}

// הפעלת/כיבוי מצב טעינה
function setLoadingState(isLoading) {
    if (!registerForm) return;
    
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const inputs = registerForm.querySelectorAll('input');
    
    if (isLoading) {
        submitButton.disabled = true;
        submitButton.textContent = 'נרשם...';
        inputs.forEach(input => input.disabled = true);
    } else {
        submitButton.disabled = false;
        submitButton.textContent = 'הירשם';
        inputs.forEach(input => input.disabled = false);
    }
}

// המרת שגיאות Supabase להודעות מובנות
function getErrorMessage(error) {
    console.log('שגיאה מלאה בהרשמה:', error); // לדיבוג
    
    const errorMessage = error.message || '';
    
    // בדיקת הודעות שגיאה שונות של Supabase
    if (errorMessage.includes('User already registered') || errorMessage.includes('already been registered')) {
        return 'המשתמש כבר רשום במערכת - נסה להתחבר';
    }
    
    if (errorMessage.includes('Password should be at least 6 characters')) {
        return 'הסיסמה חייבת להכיל לפחות 6 תווים';
    }
    
    if (errorMessage.includes('Invalid email')) {
        return 'כתובת אימייל לא תקינה';
    }
    
    if (errorMessage.includes('Signup is disabled')) {
        return 'ההרשמה אינה זמינה כעת';
    }
    
    if (errorMessage.includes('weak password') || errorMessage.includes('Password is too weak')) {
        return 'הסיסמה חלשה מדי - השתמש באותיות, מספרים ותווים מיוחדים';
    }
    
    if (errorMessage.includes('Network error') || errorMessage.includes('fetch')) {
        return 'בעיית חיבור לרשת - בדוק את החיבור לאינטרנט';
    }
    
    // אם אין התאמה, נציג את השגיאה המקורית
    return errorMessage || 'אירעה שגיאה לא צפויה - נסה שוב';
} 