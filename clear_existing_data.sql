-- מחיקת נתונים מטבלאות קיימות בלבד - גרסה מקיפה
-- הסקריפט בודק קודם אם הטבלה קיימת ומנקה את כל הנתונים הקשורים לאימות

-- מחיקת תגובות (אם הטבלה קיימת)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') THEN
        DELETE FROM comments;
        RAISE NOTICE 'נתונים נמחקו מטבלת comments';
    ELSE
        RAISE NOTICE 'טבלת comments לא קיימת';
    END IF;
END$$;

-- מחיקת לייקים (אם הטבלה קיימת)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'likes') THEN
        DELETE FROM likes;
        RAISE NOTICE 'נתונים נמחקו מטבלת likes';
    ELSE
        RAISE NOTICE 'טבלת likes לא קיימת';
    END IF;
END$$;

-- מחיקת פוסטים (אם הטבלה קיימת)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') THEN
        DELETE FROM posts;
        RAISE NOTICE 'נתונים נמחקו מטבלת posts';
    ELSE
        RAISE NOTICE 'טבלת posts לא קיימת';
    END IF;
END$$;

-- מחיקת פרופילים (אם הטבלה קיימת)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
        DELETE FROM profiles;
        RAISE NOTICE 'נתונים נמחקו מטבלת profiles';
    ELSE
        RAISE NOTICE 'טבלת profiles לא קיימת';
    END IF;
END$$;

-- מחיקת טבלאות auth של Supabase - ניקוי מקיף
DO $$
BEGIN
    -- מחיקת sessions (התחברויות פעילות)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'sessions') THEN
        DELETE FROM auth.sessions;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.sessions';
    END IF;
    
    -- מחיקת refresh_tokens (טוקנים לרענון)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'refresh_tokens') THEN
        DELETE FROM auth.refresh_tokens;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.refresh_tokens';
    END IF;
    
    -- מחיקת audit_log_entries (לוגים של פעולות אימות)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'audit_log_entries') THEN
        DELETE FROM auth.audit_log_entries;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.audit_log_entries';
    END IF;
    
    -- מחיקת instances (אם קיימת)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'instances') THEN
        DELETE FROM auth.instances;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.instances';
    END IF;
    
    -- מחיקת identities (זהויות חיצוניות כמו Google, GitHub וכו')
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'identities') THEN
        DELETE FROM auth.identities;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.identities';
    END IF;
    
    -- מחיקת mfa_factors (אימות דו-שלבי)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'mfa_factors') THEN
        DELETE FROM auth.mfa_factors;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.mfa_factors';
    END IF;
    
    -- מחיקת mfa_challenges (אתגרי אימות דו-שלבי)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'mfa_challenges') THEN
        DELETE FROM auth.mfa_challenges;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.mfa_challenges';
    END IF;
    
    -- מחיקת sso_providers (ספקי SSO)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'sso_providers') THEN
        DELETE FROM auth.sso_providers;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.sso_providers';
    END IF;
    
    -- מחיקת sso_domains (דומיינים של SSO)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'sso_domains') THEN
        DELETE FROM auth.sso_domains;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.sso_domains';
    END IF;
    
    -- מחיקת flow_state (מצב זרימת האימות)
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'flow_state') THEN
        DELETE FROM auth.flow_state;
        RAISE NOTICE 'נתונים נמחקו מטבלת auth.flow_state';
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'שגיאה במחיקת טבלאות auth: %', SQLERRM;
END$$;

-- מחיקת משתמשים מטבלת auth.users - בסוף כדי שלא תהיה בעיה עם foreign keys
DO $$
BEGIN
    DELETE FROM auth.users;
    RAISE NOTICE 'כל המשתמשים נמחקו מטבלת auth.users';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'שגיאה במחיקת משתמשים: %', SQLERRM;
END$$;

-- הערה: טבלת email_verifications נמחקה לגמרי ולא צריכה ניקוי
SELECT 'הערה: טבלת email_verifications נמחקה לגמרי כחלק מתיקון הבעיות' as notice;

-- איפוס רצפים (אם קיימים)
DO $$
BEGIN
    -- איפוס רצף comments
    IF EXISTS (SELECT FROM information_schema.sequences WHERE sequence_name = 'comments_id_seq') THEN
        ALTER SEQUENCE comments_id_seq RESTART WITH 1;
        RAISE NOTICE 'רצף comments_id_seq אופס';
    END IF;
    
    -- איפוס רצף likes
    IF EXISTS (SELECT FROM information_schema.sequences WHERE sequence_name = 'likes_id_seq') THEN
        ALTER SEQUENCE likes_id_seq RESTART WITH 1;
        RAISE NOTICE 'רצף likes_id_seq אופס';
    END IF;
    
    -- איפוס רצף posts
    IF EXISTS (SELECT FROM information_schema.sequences WHERE sequence_name = 'posts_id_seq') THEN
        ALTER SEQUENCE posts_id_seq RESTART WITH 1;
        RAISE NOTICE 'רצף posts_id_seq אופס';
    END IF;
    
    -- הערה: רצף email_verifications נמחק יחד עם הטבלה
    RAISE NOTICE 'רצף email_verifications_id_seq נמחק יחד עם הטבלה';
END$$;

-- בדיקת סטטוס טבלאות - בדיקה מקיפה
SELECT 
    'מחיקת נתונים הושלמה!' as message,
    (SELECT COUNT(*) FROM auth.users) as users_count,
    (SELECT COUNT(*) FROM auth.sessions) as sessions_count,
    (SELECT COUNT(*) FROM auth.refresh_tokens) as refresh_tokens_count,
    (SELECT COUNT(*) FROM auth.audit_log_entries) as audit_logs_count,
    (SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') 
              THEN (SELECT COUNT(*) FROM profiles) 
              ELSE 0 END) as profiles_count,
    (SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'posts') 
              THEN (SELECT COUNT(*) FROM posts) 
              ELSE 0 END) as posts_count,
    (SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'likes') 
              THEN (SELECT COUNT(*) FROM likes) 
              ELSE 0 END) as likes_count,
    (SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') 
              THEN (SELECT COUNT(*) FROM comments) 
              ELSE 0 END) as comments_count,
    CASE 
        WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'email_verifications') 
        THEN '⚠️ טבלת email_verifications עדיין קיימת'
        ELSE '✅ טבלת email_verifications נמחקה (כמתוכנן)'
    END as email_verifications_status;

-- הודעת סיום
SELECT 'ניקוי נתונים מקיף הושלם! כל המשתמשים, הסשנים, הטוקנים והנתונים נמחקו. המערכת מוכנה לחלוטין לבדיקות חדשות.' as final_message; 