// הגדרות Supabase
const SUPABASE_URL = 'https://bhyzswlinykqmijvxyeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXpzd2xpbnlrcW1panZ4eWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDIwODksImV4cCI6MjA2NTIxODA4OX0.b9A6uXSWAs26clkzXGrvgVtVjAYN9WMwCtk0K3TvulE';

// אתחול משתנים
let supabase = null;
let loginForm = null;
let messageDiv = null;

// המתנה לטעינת ה-DOM ו-Supabase
document.addEventListener('DOMContentLoaded', async () => {
    // המתנה לטעינת Supabase
    await waitForSupabase();
    
    // עדכון המשתנים עם האלמנטים הקיימים
    loginForm = document.getElementById('loginForm');
    messageDiv = document.getElementById('message');
    
    // הוספת מאזיני אירועים
    initializeEventListeners();
    
    // בדיקת סטטוס אימות
    checkAuthStatus();
});

// המתנה לטעינת Supabase
async function waitForSupabase() {
    let attempts = 0;
    const maxAttempts = 20;
    
    while (!window.supabase && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase נטען בהצלחה');
    } else {
        console.error('שגיאה בטעינת Supabase');
        showMessage('שגיאה בטעינת המערכת - נסה לרענן את הדף', 'error');
    }
}

// הוספת מאזיני אירועים
function initializeEventListeners() {
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// טיפול בהתחברות
async function handleLogin(event) {
    event.preventDefault();
    
    if (!supabase) {
        showMessage('המערכת עדיין נטענת - נסה שוב בעוד רגע', 'error');
        return;
    }
    
    // ניקוי הודעות קודמות
    hideMessage();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // הפעלת מצב טעינה
    setLoadingState(true);

    try {
        console.log('מנסה להתחבר עם:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        console.log('תגובה מ-Supabase:', { data, error });

        if (error) {
            throw error;
        }

        showMessage('התחברות הצליחה! מעביר לדף הבית...', 'success');
        
        // מעבר לדשבורד לאחר 2 שניות
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);

    } catch (error) {
        console.error('שגיאה בהתחברות:', error);
        
        const errorMsg = getErrorMessage(error);
        console.log('הודעת שגיאה שתוצג:', errorMsg);
        showMessage(errorMsg, 'error');
        
        // אם השגיאה מרמזת שהמשתמש לא רשום, נוסיף הנחיה
        if (errorMsg.includes('לא נרשמת') || errorMsg.includes('לא נמצא')) {
            setTimeout(() => {
                const currentMsg = messageDiv.textContent;
                messageDiv.innerHTML = currentMsg + '<br><a href="register.html" style="color: #667eea; text-decoration: underline;">לחץ כאן להרשמה</a>';
            }, 100);
        }
    } finally {
        setLoadingState(false);
    }
}

// בדיקת סטטוס אימות
async function checkAuthStatus() {
    if (!supabase) return;
    
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
    console.log('מציג הודעה:', text, 'סוג:', type);
    
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
        console.log('הודעה הוצגה בהצלחה');
    } else {
        console.error('messageDiv לא נמצא!');
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
    if (!loginForm) return;
    
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const inputs = loginForm.querySelectorAll('input');
    
    if (isLoading) {
        submitButton.disabled = true;
        submitButton.textContent = 'מתחבר...';
        inputs.forEach(input => input.disabled = true);
    } else {
        submitButton.disabled = false;
        submitButton.textContent = 'התחבר';
        inputs.forEach(input => input.disabled = false);
    }
}

// המרת שגיאות Supabase להודעות מובנות
function getErrorMessage(error) {
    console.log('שגיאה מלאה:', error);
    console.log('הודעת שגיאה גולמית:', error.message);
    
    const errorMessage = error.message || '';
    console.log('הודעה לבדיקה:', errorMessage);
    
    // בדיקת הודעות שגיאה שונות של Supabase
    if (errorMessage.includes('Invalid login credentials')) {
        console.log('זוהתה שגיאת התחברות');
        return 'אימייל או סיסמה שגויים - אולי עוד לא נרשמת?';
    }
    
    if (errorMessage.includes('Email not confirmed')) {
        return 'יש לאמת את כתובת האימייל לפני ההתחברות';
    }
    
    if (errorMessage.includes('Invalid email')) {
        return 'כתובת אימייל לא תקינה';
    }
    
    if (errorMessage.includes('User not found')) {
        return 'משתמש לא נמצא - יש להירשם קודם';
    }
    
    if (errorMessage.includes('Too many requests')) {
        return 'יותר מדי ניסיונות התחברות - נסה שוב בעוד כמה דקות';
    }
    
    if (errorMessage.includes('Network error') || errorMessage.includes('fetch')) {
        return 'בעיית חיבור לרשת - בדוק את החיבור לאינטרנט';
    }
    
    if (errorMessage.includes('Database error')) {
        return 'שגיאה במסד הנתונים - נסה שוב מאוחר יותר';
    }
    
    // אם אין התאמה, נציג את השגיאה המקורית
    console.log('לא נמצאה התאמה - מחזיר הודעה כללית');
    return errorMessage || 'אירעה שגיאה לא צפויה - נסה שוב';
} 