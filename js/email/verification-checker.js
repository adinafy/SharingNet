// Email Verification Checker - Uses profiles table
const EmailVerificationChecker = {
    _lastCheckTimestamp: 0,
    _minimumCheckInterval: 2000, // 2 seconds

    async check(fromLogin = false) {
        // Prevent too frequent checks
        const now = Date.now();
        if (now - this._lastCheckTimestamp < this._minimumCheckInterval) {
            console.log('Skipping verification check - too soon');
            return;
        }
        this._lastCheckTimestamp = now;

        console.log('Checking email verification from profiles table...');
        console.log('Check called from login:', fromLogin);
        
        if (!AppState.currentUser) {
            console.log('No current user found');
            return;
        }

        console.log('Current user ID:', AppState.currentUser.id);
        console.log('Current user email:', AppState.currentUser.email);
        console.log('Current user email_confirmed_at:', AppState.currentUser.email_confirmed_at);

        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', AppState.currentUser.id)
                .single();

            console.log('Profile found:', profile);

            if (profile) {
                console.log('Profile email_verified field:', profile.email_verified);
                console.log('Profile created_at:', profile.created_at);
                console.log('Profile updated_at:', profile.updated_at);

                // Set profile in state
                AppState.setUserProfile(profile);

                // If email is already verified, no need to check further
                if (profile.email_verified) {
                    console.log('Email is already verified');
                    AppState.setEmailVerified(true);
                    return;
                }

                // Check if email was confirmed in auth but not in profile
                if (AppState.currentUser.email_confirmed_at) {
                    console.log('Email confirmed in auth, updating profile');
                    await supabase
                        .from('profiles')
                        .update({ email_verified: true })
                        .eq('id', AppState.currentUser.id);
                    
                    AppState.setEmailVerified(true);
                    console.log('Email is verified');
                } else {
                    AppState.setEmailVerified(false);
                    console.log('Email is not verified - waiting for manual login');
                }
            }
        } catch (error) {
            console.error('Error checking email verification:', error);
        }
    }
}; 