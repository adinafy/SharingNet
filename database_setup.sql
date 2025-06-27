-- SharingNet Database Setup
-- Run this script in your Supabase SQL Editor
-- 
-- IMPORTANT: Enable email confirmation in Authentication > Settings
-- Set "Enable email confirmations" to ON for full email verification

-- 1. Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 2. Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. Create likes table
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS for likes
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Likes policies
CREATE POLICY "Likes are viewable by everyone"
ON likes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create likes"
ON likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
ON likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 4. Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- הערה: טבלת email_verifications נמחקה כי היא גרמה לבעיות ולא הייתה בשימוש

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- Create a function to automatically create user profile on signup
-- This ensures every user gets a profile entry immediately upon registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, email_verified, created_at, updated_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)), 
    NEW.email,
    NEW.email_confirmed_at IS NOT NULL,
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- במקרה של שגיאה, רשום אותה אבל אל תכשיל את יצירת המשתמש
    RAISE WARNING 'שגיאה ביצירת פרופיל למשתמש %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle email confirmation - גרסה מתוקנת ופשוטה
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmation()
RETURNS TRIGGER AS $$
BEGIN
    -- עדכון סטטוס אימות המייל בפרופיל בלבד
    UPDATE public.profiles 
    SET email_verified = true, updated_at = NOW()
    WHERE id = NEW.id;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- במקרה של שגיאה, רשום אותה אבל אל תכשיל את האימות
        RAISE WARNING 'שגיאה בעדכון אימות מייל למשתמש %: %', NEW.id, SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger to handle email confirmation
CREATE TRIGGER on_user_email_confirmed
    AFTER UPDATE OF email_confirmed_at ON auth.users
    FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_user_email_confirmation();

-- בדיקת תקינות התקנה
DO $$
DECLARE
    tables_count INTEGER;
    triggers_count INTEGER;
    functions_count INTEGER;
BEGIN
    -- ספירת טבלאות
    SELECT COUNT(*) INTO tables_count
    FROM information_schema.tables 
    WHERE table_name IN ('profiles', 'posts', 'likes', 'comments')
    AND table_schema = 'public';
    
    -- ספירת טריגרים
    SELECT COUNT(*) INTO triggers_count
    FROM information_schema.triggers 
    WHERE trigger_name IN ('on_auth_user_created', 'on_user_email_confirmed');
    
    -- ספירת פונקציות
    SELECT COUNT(*) INTO functions_count
    FROM information_schema.routines 
    WHERE routine_name IN ('handle_new_user', 'handle_user_email_confirmation')
    AND routine_schema = 'public';
    
    -- הודעות סטטוס
    RAISE NOTICE 'נוצרו % טבלאות מתוך 4', tables_count;
    RAISE NOTICE 'נוצרו % טריגרים מתוך 2', triggers_count;
    RAISE NOTICE 'נוצרו % פונקציות מתוך 2', functions_count;
    
    IF tables_count = 4 AND triggers_count = 2 AND functions_count = 2 THEN
        RAISE NOTICE '✅ כל הרכיבים נוצרו בהצלחה!';
    ELSE
        RAISE WARNING '⚠️ יש בעיה ביצירת חלק מהרכיבים';
    END IF;
END$$;

-- הוראות ידניות נדרשות ב-Supabase Dashboard:
-- 1. לך ל-Authentication > Settings
-- 2. הגדר "Enable email confirmations" לפי הצורך:
--    - ON = אימות מייל נדרש
--    - OFF = כניסה מיידית ללא אימות
-- 3. הגדר Site URL ו-Redirect URLs לכתובת האתר שלך (Vercel)
-- 4. בדוק Email Templates אם נדרש

-- הודעת סיום
SELECT '🎉 הגדרת מסד הנתונים הושלמה בהצלחה! המערכת מוכנה לשימוש.' as message; 