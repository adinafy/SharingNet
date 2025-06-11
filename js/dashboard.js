// הגדרות Supabase
const SUPABASE_URL = 'https://bhyzswlinykqmijvxyeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoeXpzd2xpbnlrcW1panZ4eWVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDIwODksImV4cCI6MjA2NTIxODA4OX0.b9A6uXSWAs26clkzXGrvgVtVjAYN9WMwCtk0K3TvulE';

// אתחול משתנים
let supabase = null;
let userInfoDiv = null;
let logoutBtn = null;

// המתנה לטעינת ה-DOM ו-Supabase
document.addEventListener('DOMContentLoaded', async () => {
    // המתנה לטעינת Supabase
    await waitForSupabase();
    
    // עדכון המשתנים עם האלמנטים הקיימים
    userInfoDiv = document.getElementById('user-info');
    logoutBtn = document.getElementById('logout-btn');
    
    // הוספת מאזיני אירועים
    initializeEventListeners();
    
    // בדיקת אימות וטעינת פרטי משתמש
    await checkAuth();
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
        if (userInfoDiv) {
            userInfoDiv.textContent = 'שגיאה בטעינת המערכת - נסה לרענן את הדף';
        }
    }
}

// הוספת מאזיני אירועים
function initializeEventListeners() {
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// בדיקת אימות וטעינת פרטי משתמש
async function checkAuth() {
    if (!supabase) {
        window.location.href = 'index.html';
        return;
    }
    
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
    if (!supabase) return;
    
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