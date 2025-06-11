// הגדרות Supabase
const SUPABASE_URL = 'https://bhyzswlinykqmijvxyeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXpzd2xpbnlrcW1panZ4eWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDIwODksImV4cCI6MjA2NTIxODA4OX0.b9A6uXSWAs26clkzXGrvgVtVjAYN9WMwCtk0K3TvulE';

// אתחול משתנים
let supabase = null;

// המתנה לטעינת ה-DOM ו-Supabase
document.addEventListener('DOMContentLoaded', async () => {
    // המתנה לטעינת Supabase
    await waitForSupabase();
    
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