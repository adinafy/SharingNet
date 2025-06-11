// ייבוא הגדרות Supabase
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

// אתחול משתנים עם ערכים ריקים - למניעת בעיות timing
let supabase = null;
let userInfoDiv = null;
let logoutBtn = null;

// טעינת ספריית Supabase
async function loadSupabase() {
    try {
        const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
        supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase נטען בהצלחה');
    } catch (error) {
        console.error('שגיאה בטעינת Supabase:', error);
    }
}

// התחלת האפליקציה
document.addEventListener('DOMContentLoaded', async () => {
    // עדכון המשתנים עם האלמנטים הקיימים
    userInfoDiv = document.getElementById('user-info');
    logoutBtn = document.getElementById('logout-btn');
    
    // טעינת Supabase
    await loadSupabase();
    
    // הוספת מאזיני אירועים
    initializeEventListeners();
    
    // בדיקת אימות וטעינת פרטי משתמש
    await checkAuth();
});

// הוספת מאזיני אירועים
function initializeEventListeners() {
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// בדיקת אימות וטעינת פרטי משתמש
async function checkAuth() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
            // המשתמש לא מחובר - מעבר לדף הראשי
            window.location.href = 'index.html';
            return;
        }
        
        // טעינת פרטי המשתמש מהטבלה
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('username')
            .eq('id', user.id)
            .single();
        
        if (userProfile && userInfoDiv) {
            userInfoDiv.textContent = `שלום ${userProfile.username}! (${user.email})`;
        } else if (userInfoDiv) {
            userInfoDiv.textContent = `שלום ${user.email}!`;
        }
        
    } catch (error) {
        console.error('שגיאה:', error);
        window.location.href = 'index.html';
    }
}

// התנתקות
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('שגיאה בהתנתקות:', error);
        // גם אם יש שגיאה, נוביל לדף הראשי
        window.location.href = 'index.html';
    }
} 