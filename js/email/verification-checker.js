// Email Verification Checker - Uses profiles table
const EmailVerificationChecker = {
    async check(fromLogin = false) {
        if (!AppState.currentUser) {
            console.log('🚫 No current user, redirecting to auth section');
            NavigationUI.showAuthSection();
            return;
        }
        
        console.log('🔍 Checking email verification from profiles table...');
        console.log('🔍 Check called from login:', fromLogin);
        console.log('🔍 Current user ID:', AppState.currentUser.id);
        console.log('🔍 Current user email:', AppState.currentUser.email);
        console.log('🔍 Current user email_confirmed_at:', AppState.currentUser.email_confirmed_at);
        
        try {
            // Get user profile from profiles table (not auth.users)
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('id, full_name, email, email_verified, created_at, updated_at')
                .eq('id', AppState.currentUser.id)
                .single();

            if (error) {
                console.error('❌ Error getting profile:', error);
                console.error('❌ Error code:', error.code);
                console.error('❌ Error message:', error.message);
                
                // If profile doesn't exist, user might be newly created
                if (error.code === 'PGRST116') {
                    console.log('⏳ Profile not found, user might be newly created - retrying in 1 second...');
                    // Wait a moment and try again
                    setTimeout(() => this.check(fromLogin), 1000);
                    return;
                }
                
                console.log('🔄 Redirecting to auth section due to profile error');
                NavigationUI.showAuthSection();
                return;
            }

            if (profile) {
                console.log('✅ Profile found:', profile);
                console.log('📧 Profile email_verified field:', profile.email_verified);
                console.log('📅 Profile created_at:', profile.created_at);
                console.log('📅 Profile updated_at:', profile.updated_at);
                
                AppState.setUserProfile(profile);
                
                console.log('🔍 AppState.isEmailVerified after setUserProfile:', AppState.isEmailVerified);
                
                if (AppState.isEmailVerified) {
                    // Email is verified - go to main app
                    console.log('✅ Email is verified - going to main app');
                    NavigationUI.showMainApp();
                    await PostLoader.load();
                    if (fromLogin) {
                        MessageManager.success('ברוכים הבאים! התחברת בהצלחה.');
                    } else {
                        MessageManager.success('ברוכים הבאים! המייל אומת בהצלחה.');
                    }
                } else {
                    console.log('❌ Email is NOT verified');
                    console.log('🔍 fromLogin parameter:', fromLogin);
                    
                    // Email not verified - only show verification if this is from login or registration
                    // Don't automatically redirect to verification from other places
                    if (fromLogin) {
                        console.log('📧 Showing verification section because called from login');
                        NavigationUI.showVerificationSection();
                        // Set email for verification display
                        const emailEl = document.getElementById('verificationEmail');
                        if (emailEl && profile.email) {
                            emailEl.textContent = profile.email;
                            console.log('📧 Set verification email display to:', profile.email);
                        }
                        MessageManager.warning('עליך לאמת את המייל שלך לפני הכניסה למערכת. בדוק את תיבת הדואר שלך.');
                    } else {
                        // If called from other places and email not verified, go back to auth
                        console.log('🔄 Email not verified, redirecting to auth section (not from login)');
                        NavigationUI.showAuthSection();
                        MessageManager.info('עליך לאמת את המייל שלך ולהתחבר מחדש.');
                    }
                }
            } else {
                console.log('❌ No profile found for user (profile is null)');
                NavigationUI.showAuthSection();
            }
        } catch (error) {
            console.error('❌ Exception in email verification check:', error);
            console.error('❌ Exception stack:', error.stack);
            NavigationUI.showAuthSection();
        }
    }
}; 