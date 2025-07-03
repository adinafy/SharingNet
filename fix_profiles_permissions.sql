-- Fix profiles table permissions - run in Supabase SQL Editor
-- This fixes the "permission denied for table users" error

-- 1. Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Verified profiles are viewable by verified users" ON profiles;

-- 2. Create simpler, more permissive policies
CREATE POLICY "Enable read access for authenticated users" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for users based on id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3. Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO anon;

-- 5. Check current policies
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Test query that should work now
SELECT 
    'Testing profiles access' as test,
    COUNT(*) as profile_count
FROM profiles;

SELECT 'Profiles permissions fixed!' as status; 