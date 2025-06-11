// ייבוא הגדרות Supabase
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config.js';

// אתחול משתנים עם ערכים ריקים - למניעת בעיות timing
let supabase = null;

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
    // טעינת Supabase
    await loadSupabase();
    
    // בדיקת סטטוס אימות
    checkAuthStatus();
});

// בדיקת סטטוס אימות
async function checkAuthStatus() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            // המשתמש כבר מחובר - מעבר לדשבורד
            window.location.href = 'dashboard.html';
        }
        // אם לא מחובר, נשאר בדף הראשי
    } catch (error) {
        console.error('שגיאה בבדיקת סטטוס אימות:', error);
        // אם יש שגיאה, נשאר בדף הראשי
    }
} 