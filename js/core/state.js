// Global Application State - matches database_setup.sql structure
const AppState = {
    currentUser: null,        // auth.users data
    userProfile: null,        // profiles table data
    posts: [],               // posts array
    isEmailVerified: false,  // from profiles.email_verified
    
    setCurrentUser(user) {
        this.currentUser = user;
    },
    
    setUserProfile(profile) {
        this.userProfile = profile;
        // Update email verification status from profiles table
        this.isEmailVerified = profile?.email_verified || false;
    },
    
    setPosts(posts) {
        this.posts = posts;
    },
    
    setEmailVerified(verified) {
        this.isEmailVerified = verified;
    },
    
    getUserDisplayName() {
        // Use full_name from profiles table or email as fallback
        return this.userProfile?.full_name || this.currentUser?.email || 'משתמש';
    },
    
    reset() {
        this.currentUser = null;
        this.userProfile = null;
        this.posts = [];
        this.isEmailVerified = false;
    },

    // Initialize cross-tab communication for email confirmation
    initCrossTabSync() {
        // Listen for email confirmation events from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'sharingnet_email_confirmed' && e.newValue) {
                console.log('🔄 Email confirmation detected in another tab - cleaning up this tab');
                
                // Sign out and reset state in this tab
                supabase.auth.signOut();
                this.reset();
                NavigationUI.showAuthSection();
                
                // Make sure we're on the login tab
                if (DOM.loginTab && DOM.registerTab) {
                    DOM.loginTab.classList.add('active');
                    DOM.registerTab.classList.remove('active');
                    DOM.loginForm.classList.remove('hidden');
                    DOM.registerForm.classList.add('hidden');
                }
                
                MessageManager.info('המייל אומת בטאב אחר. התחבר כאן עם המייל והסיסמה שלך.');
                
                // Clean up the localStorage after handling
                setTimeout(() => {
                    localStorage.removeItem('sharingnet_email_confirmed');
                }, 1000);
            }
        });
    }
}; 