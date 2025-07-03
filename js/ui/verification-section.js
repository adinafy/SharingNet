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
                    <p class="verification-instructions">
                        בדוק את המייל שלך ולחץ על קישור האימות.
                    </p>
                    
                    <div class="verification-actions">
                        <button id="resendEmailBtn" class="btn btn-primary">
                            <i class="fas fa-envelope"></i>
                            שלח מייל אימות שוב
                        </button>
                        
                        <button id="verificationLogoutBtn" class="btn btn-secondary">
                            <i class="fas fa-sign-out-alt"></i>
                            חזור להתחברות
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
    }
}; 