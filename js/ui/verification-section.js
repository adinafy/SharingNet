// Email Verification UI
const VerificationUI = {
    create() {
        const verificationHTML = `
            <div id="verificationSection" class="auth-container">
                <div class="auth-form">
                    <div class="verification-icon">📧</div>
                    <h2>נשלח אימות במייל!</h2>
                    <p class="verification-message">
                        שלחנו הודעת אימות לכתובת: <strong id="verificationEmail"></strong>
                    </p>
                    <div class="verification-instructions">
                        <h4>🔍 לא קיבלת מייל?</h4>
                        <p>לחץ על "שלח מייל אימות שוב" ובדוק גם בתיקיית הספאם.</p>
                        
                        <h4>📧 קיבלת כבר מייל אימות?</h4>
                        <p><strong>חשוב:</strong> לפני לחיצה על הקישור במייל, עליך לצאת מהמסך הזה!</p>
                        <p>לחץ על <strong>"התנתק וסגור דף"</strong> ואז השתמש בקישור במייל להתחברות.</p>
                        
                        <div class="warning-box">
                            ⚠️ <strong>חובה להתנתק לפני השימוש בקישור האימות!</strong>
                        </div>
                    </div>
                    
                    <div class="verification-actions">
                        <button id="resendEmailBtn" class="btn btn-primary">
                            <i class="fas fa-envelope"></i>
                            שלח מייל אימות שוב
                        </button>
                        
                        <button id="verificationLogoutBtn" class="btn btn-secondary">
                            <i class="fas fa-sign-out-alt"></i>
                            חזור להתחברות
                        </button>
                        
                        <button id="logoutAndCloseBtn" class="btn btn-danger">
                            <i class="fas fa-times-circle"></i>
                            התנתק וסגור דף
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        DOM.authSection.insertAdjacentHTML('afterend', verificationHTML);
        DOM.verificationSection = document.getElementById('verificationSection');
        
        // Add event listeners for the buttons
        this.attachEventListeners();
    },

    attachEventListeners() {
        const resendBtn = document.getElementById('resendEmailBtn');
        const logoutBtn = document.getElementById('verificationLogoutBtn');
        const logoutAndCloseBtn = document.getElementById('logoutAndCloseBtn');
        
        if (resendBtn) {
            resendBtn.addEventListener('click', async () => {
                await EmailResend.handle();
            });
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                // Sign out and return to auth section
                await supabase.auth.signOut();
                AppState.reset();
                NavigationUI.showAuthSection();
                MessageManager.info('חזרת למסך ההתחברות. תוכל להתחבר לאחר אימות המייל.');
            });
        }
        
        if (logoutAndCloseBtn) {
            logoutAndCloseBtn.addEventListener('click', async () => {
                try {
                    // Sign out the user first
                    await supabase.auth.signOut();
                    AppState.reset();
                    
                    // Show confirmation message briefly
                    MessageManager.success('התנתקת בהצלחה. הדף ייסגר כעת. השתמש בקישור במייל להתחברות.');
                    
                    // Close the tab after a short delay
                    setTimeout(() => {
                        window.close();
                        // If window.close() doesn't work (some browsers block it), redirect to blank page
                        if (!window.closed) {
                            window.location.href = 'about:blank';
                        }
                    }, 2000);
                    
                } catch (error) {
                    console.error('Error during logout and close:', error);
                    MessageManager.error('שגיאה בהתנתקות');
                }
            });
        }
    }
}; 