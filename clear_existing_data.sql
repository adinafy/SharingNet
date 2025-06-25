-- מחיקת נתונים מטבלאות קיימות בלבד
-- הסקריפט בודק קודם אם הטבלה קיימת

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

-- מחיקת אימותי מייל (אם הטבלה קיימת)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'email_verifications') THEN
        DELETE FROM email_verifications;
        RAISE NOTICE 'נתונים נמחקו מטבלת email_verifications';
    ELSE
        RAISE NOTICE 'טבלת email_verifications לא קיימת';
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
    
    -- איפוס רצף email_verifications
    IF EXISTS (SELECT FROM information_schema.sequences WHERE sequence_name = 'email_verifications_id_seq') THEN
        ALTER SEQUENCE email_verifications_id_seq RESTART WITH 1;
        RAISE NOTICE 'רצף email_verifications_id_seq אופס';
    END IF;
END$$;

-- הודעת סיום
SELECT 'מחיקת נתונים הושלמה!' as message; 