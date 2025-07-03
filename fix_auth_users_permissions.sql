-- תיקון בעיית הרשאות auth.users
-- יש שתי אפשרויות:

-- אפשרות 1: מחיקת הטריגרים (מומלץ)
-- מחיקה זמנית של הטריגרים הבעייתיים
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;

-- מחיקת הפונקציות
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_email_confirmation();

-- אפשרות 2: נתינת הרשאות (אם צריך את הטריגרים)
-- GRANT SELECT, UPDATE ON auth.users TO authenticated;

SELECT 'הטריגרים הבעייתיים נמחקו - זה אמור לפתור את בעיית הרשאות auth.users' as message; 