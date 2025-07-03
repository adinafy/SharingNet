-- Debug script to check database triggers and functions
-- Run this in Supabase SQL Editor to debug email verification issues

-- 1. Check if triggers exist
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name IN ('on_auth_user_created', 'on_user_email_confirmed');

-- 2. Check if functions exist
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name IN ('handle_new_user', 'handle_user_email_confirmation')
AND routine_schema = 'public';

-- 3. Check current users and their email verification status
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at as user_created,
    p.email_verified,
    p.created_at as profile_created,
    p.updated_at as profile_updated
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC
LIMIT 10;

-- 4. Check if there are profiles without email_verified = true
SELECT 
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_profiles,
    COUNT(CASE WHEN email_verified = false OR email_verified IS NULL THEN 1 END) as unverified_profiles
FROM public.profiles;

-- 5. Manual test to see what happens when we simulate email confirmation
-- This will help us understand if the trigger works
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Find a user who is not verified
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email_confirmed_at IS NULL 
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        RAISE NOTICE 'Found unverified user: %', test_user_id;
        
        -- Check current profile status
        RAISE NOTICE 'Profile before: %', (
            SELECT row_to_json(p) 
            FROM public.profiles p 
            WHERE id = test_user_id
        );
        
        -- Simulate email confirmation (DON'T ACTUALLY DO THIS IN PRODUCTION!)
        -- UPDATE auth.users 
        -- SET email_confirmed_at = NOW() 
        -- WHERE id = test_user_id;
        
        RAISE NOTICE 'To test manually: UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = ''%'';', test_user_id;
        
    ELSE
        RAISE NOTICE 'No unverified users found to test with';
    END IF;
END$$;

-- 6. Check RLS policies on profiles table
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

-- Final summary
SELECT 'Database Debug Complete - Check the results above' as status; 