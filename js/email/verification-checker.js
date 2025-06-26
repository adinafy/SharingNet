// Email Verification Checker - Uses profiles table
const EmailVerificationChecker = {
    async check() {
        if (!AppState.currentUser) {
            NavigationUI.showAuthSection();
            return;
        }
        
        console.log('🔍 Checking email verification from profiles table...');
        
        try {
            // Get user profile from profiles table (not auth.users)
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('id, full_name, email, email_verified, created_at, updated_at')
                .eq('id', AppState.currentUser.id)
                .single();

            if (error) {
                console.error('❌ Error getting profile:', error);
                
                // If profile doesn't exist, user might be newly created
                if (error.code === 'PGRST116') {
                    console.log('Profile not found, user might be newly created');
                    // Wait a moment and try again
                    setTimeout(() => this.check(), 1000);
                    return;
                }
                
                NavigationUI.showAuthSection();
                return;
            }

            if (profile) {
                AppState.setUserProfile(profile);
                
                console.log('📧 Email verified status:', profile.email_verified);
                console.log('✅ Profile loaded:', profile);
                
                if (AppState.isEmailVerified) {
                    NavigationUI.showMainApp();
                    await PostLoader.load();
                    MessageManager.success('ברוכים הבאים! המייל אומת בהצלחה.');
                } else {
                    NavigationUI.showVerificationSection();
                }
            } else {
                console.log('❌ No profile found for user');
                NavigationUI.showAuthSection();
            }
        } catch (error) {
            console.error('❌ Error in email verification check:', error);
            NavigationUI.showAuthSection();
        }
    }
}; 