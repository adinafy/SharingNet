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
    }
}; 