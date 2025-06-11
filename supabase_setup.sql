-- סקריפט הקמת טבלאות למערכת רשת חברתית מוזיקלית
-- הערה: יש להריץ את הסקריפט בהסופאבייס SQL אדיטור

-- הקמת טבלאות

-- טבלת משתמשים
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- הגדרת אינדקס למיקוד חיפוש משתמשים
CREATE INDEX IF NOT EXISTS users_username_idx ON public.users (username);
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- טבלת פוסטים/שיתופי שירים
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    song_url TEXT NOT NULL,
    song_title TEXT,
    song_cover TEXT,
    emotion TEXT,
    text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- הגדרת אינדקסים לטבלת פוסטים
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON public.posts (user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON public.posts (created_at DESC);

-- טבלת תגובות (עם תמיכה בתגובות לתגובות)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    emotion TEXT,
    level INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_comment_level CHECK (level <= 3)
);

-- הגדרת אינדקסים לטבלת תגובות
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON public.comments (post_id);
CREATE INDEX IF NOT EXISTS comments_user_id_idx ON public.comments (user_id);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON public.comments (parent_comment_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments (created_at DESC);

-- טבלת חברים
CREATE TABLE IF NOT EXISTS public.friends (
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    -- למנוע הוספת משתמש כחבר של עצמו
    CONSTRAINT no_self_friend CHECK (user_id <> friend_id)
);

-- הגדרת אינדקס לטבלת חברים
CREATE INDEX IF NOT EXISTS friends_user_id_idx ON public.friends (user_id);
CREATE INDEX IF NOT EXISTS friends_friend_id_idx ON public.friends (friend_id);

-- טבלת בקשות חברות
CREATE TABLE IF NOT EXISTS public.friend_requests (
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    PRIMARY KEY (sender_id, receiver_id),
    -- למנוע שליחת בקשת חברות לעצמך
    CONSTRAINT no_self_request CHECK (sender_id <> receiver_id)
);

CREATE INDEX IF NOT EXISTS friend_requests_sender_idx ON public.friend_requests (sender_id);
CREATE INDEX IF NOT EXISTS friend_requests_receiver_idx ON public.friend_requests (receiver_id);

-- טבלת התראות
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    related_id UUID NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON public.notifications (is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications (created_at DESC);

-- הגדרת RLS (Row Level Security)

-- הפעלת RLS על כל הטבלאות
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- הגדרת פוליסות אבטחה

-- טבלת משתמשים
-- צפייה: כולם יכולים לצפות במשתמשים
CREATE POLICY users_select_policy ON public.users 
    FOR SELECT USING (true);

-- עריכה: רק המשתמש עצמו יכול לערוך את הפרופיל שלו
CREATE POLICY users_update_policy ON public.users 
    FOR UPDATE USING (auth.uid() = id);

-- טבלת פוסטים
-- צפייה: כולם יכולים לצפות בפוסטים
CREATE POLICY posts_select_policy ON public.posts 
    FOR SELECT USING (true);

-- הוספה: רק משתמשים מחוברים יכולים ליצור פוסטים
CREATE POLICY posts_insert_policy ON public.posts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- עריכה/מחיקה: רק יוצר הפוסט יכול לערוך או למחוק
CREATE POLICY posts_update_policy ON public.posts 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY posts_delete_policy ON public.posts 
    FOR DELETE USING (auth.uid() = user_id);

-- טבלת תגובות
-- צפייה: כולם יכולים לצפות בתגובות
CREATE POLICY comments_select_policy ON public.comments 
    FOR SELECT USING (true);

-- הוספה: רק משתמשים מחוברים יכולים להוסיף תגובות
CREATE POLICY comments_insert_policy ON public.comments 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- עריכה/מחיקה: רק יוצר התגובה יכול לערוך או למחוק
CREATE POLICY comments_update_policy ON public.comments 
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY comments_delete_policy ON public.comments 
    FOR DELETE USING (auth.uid() = user_id);

-- טבלת חברים
-- צפייה: כולם יכולים לראות רשימות חברים
CREATE POLICY friends_select_policy ON public.friends 
    FOR SELECT USING (true);

-- הוספה/מחיקה: רק המשתמש עצמו יכול להוסיף/למחוק חברים
CREATE POLICY friends_insert_policy ON public.friends 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY friends_delete_policy ON public.friends 
    FOR DELETE USING (auth.uid() = user_id);

-- טבלת בקשות חברות
-- צפייה: משתמש יכול לראות בקשות שהוא שלח או קיבל
CREATE POLICY friend_requests_select_policy ON public.friend_requests 
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- הוספה: רק המשתמש עצמו יכול לשלוח בקשות חברות
CREATE POLICY friend_requests_insert_policy ON public.friend_requests 
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- מחיקה: משתמש יכול למחוק בקשה שהוא שלח או לדחות בקשה שהוא קיבל
CREATE POLICY friend_requests_delete_policy ON public.friend_requests 
    FOR DELETE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- טבלת התראות
-- צפייה: משתמש יכול לראות רק את ההתראות שלו
CREATE POLICY notifications_select_policy ON public.notifications 
    FOR SELECT USING (auth.uid() = user_id);

-- עריכה: משתמש יכול לעדכן את סטטוס הקריאה של ההתראות שלו
CREATE POLICY notifications_update_policy ON public.notifications 
    FOR UPDATE USING (auth.uid() = user_id);

-- טריגר לקביעת רמת התגובה באופן אוטומטי
CREATE OR REPLACE FUNCTION public.set_comment_level() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_comment_id IS NULL THEN
        NEW.level := 1;
    ELSE
        NEW.level := (SELECT level + 1 FROM public.comments WHERE id = NEW.parent_comment_id);
    END IF;
    
    -- בדיקה שהרמה לא עולה על 3
    IF NEW.level > 3 THEN
        RAISE EXCEPTION 'לא ניתן להוסיף תגובה ברמה גבוהה מ-3';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_created
    BEFORE INSERT ON public.comments
    FOR EACH ROW
    EXECUTE PROCEDURE public.set_comment_level();

-- טריגר ליצירת התראות על תגובות חדשות
CREATE OR REPLACE FUNCTION public.create_comment_notification() 
RETURNS TRIGGER AS $$
DECLARE
    post_owner_id UUID;
    parent_comment_owner_id UUID;
BEGIN
    IF NEW.parent_comment_id IS NULL THEN
        -- זו תגובה לפוסט, יש ליצור התראה לבעל הפוסט
        SELECT user_id INTO post_owner_id FROM public.posts WHERE id = NEW.post_id;
        
        -- יוצר התגובה לא צריך לקבל התראה על תגובה שהוא עצמו כתב
        IF post_owner_id <> NEW.user_id THEN
            INSERT INTO public.notifications (user_id, type, related_id)
            VALUES (post_owner_id, 'post_comment', NEW.id);
        END IF;
    ELSE
        -- זו תגובה לתגובה, יש ליצור התראה לבעל התגובה המקורית
        SELECT user_id INTO parent_comment_owner_id FROM public.comments WHERE id = NEW.parent_comment_id;
        
        -- יוצר התגובה לא צריך לקבל התראה על תגובה שהוא עצמו כתב
        IF parent_comment_owner_id <> NEW.user_id THEN
            INSERT INTO public.notifications (user_id, type, related_id)
            VALUES (parent_comment_owner_id, 'reply_comment', NEW.id);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_notification
    AFTER INSERT ON public.comments
    FOR EACH ROW
    EXECUTE PROCEDURE public.create_comment_notification();

-- טריגר ליצירת התראות על בקשות חברות חדשות
CREATE OR REPLACE FUNCTION public.create_friend_request_notification() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, type, related_id)
    VALUES (NEW.receiver_id, 'friend_request', NEW.sender_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_friend_request_notification
    AFTER INSERT ON public.friend_requests
    FOR EACH ROW
    EXECUTE PROCEDURE public.create_friend_request_notification();

-- פונקציה להוספת חבר לאחר אישור בקשת חברות
CREATE OR REPLACE FUNCTION public.add_friend_and_remove_request() 
RETURNS TRIGGER AS $$
BEGIN
    -- הוספת חבר לרשימת החברים
    INSERT INTO public.friends (user_id, friend_id)
    VALUES (OLD.receiver_id, OLD.sender_id);
    
    -- הוספת חבר גם בכיוון השני (חברות הדדית)
    INSERT INTO public.friends (user_id, friend_id)
    VALUES (OLD.sender_id, OLD.receiver_id);
    
    -- יצירת התראה על אישור בקשת החברות
    INSERT INTO public.notifications (user_id, type, related_id)
    VALUES (OLD.sender_id, 'friend_accepted', OLD.receiver_id);
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- טריגר שמופעל כאשר בקשת חברות נמחקת (מאושרת)
CREATE TRIGGER on_friend_request_accepted
    AFTER DELETE ON public.friend_requests
    FOR EACH ROW
    WHEN (pg_trigger_depth() < 1)  -- למניעת לולאה אינסופית
    EXECUTE PROCEDURE public.add_friend_and_remove_request();

-- פונקציית עזר לחיפוש משתמשים
CREATE OR REPLACE FUNCTION public.search_users(search_term TEXT)
RETURNS SETOF public.users AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.users
    WHERE username ILIKE '%' || search_term || '%'
       OR email ILIKE '%' || search_term || '%'
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 