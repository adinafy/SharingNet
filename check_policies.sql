-- בדיקת policies עבור טבלת profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('profiles', 'users');

-- בדיקת אם טבלת users קיימת
SELECT table_name, table_schema 
FROM information_schema.tables 
WHERE table_name IN ('users', 'profiles') 
AND table_schema = 'public';

-- בדיקת הרשאות על טבלת profiles
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'profiles' 
AND table_schema = 'public'; 