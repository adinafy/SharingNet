-- הוספת עמודות לטבלת profiles הקיימת
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- יצירת טבלת אימותי מייל (אם לא קיימת)
CREATE TABLE IF NOT EXISTS email_verifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    verification_code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS עבור טבלת אימותי מייל
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email verifications" ON email_verifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own email verifications" ON email_verifications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email verifications" ON email_verifications
    FOR UPDATE USING (auth.uid() = user_id);

-- עדכון פונקציית handle_new_user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, email_verified, created_at, updated_at)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- פונקציה לטיפול באימות מייל
CREATE OR REPLACE FUNCTION handle_user_email_confirmation()
RETURNS trigger AS $$
BEGIN
    -- עדכון סטטוס אימות המייל בפרופיל
    UPDATE profiles 
    SET email_verified = true, updated_at = NOW()
    WHERE id = new.id;
    
    -- מחיקת רשומות אימות ישנות
    DELETE FROM email_verifications 
    WHERE user_id = new.id;
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- יצירת טריגר לאימות מייל (אם לא קיים)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_user_email_confirmed') THEN
        CREATE TRIGGER on_user_email_confirmed
            AFTER UPDATE OF email_confirmed_at ON auth.users
            FOR EACH ROW WHEN (old.email_confirmed_at IS NULL AND new.email_confirmed_at IS NOT NULL)
            EXECUTE FUNCTION handle_user_email_confirmation();
    END IF;
END$$;

-- הודעת סיום
SELECT 'רכיבי אימות המייל נוספו בהצלחה!' as message; 