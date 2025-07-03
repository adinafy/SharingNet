// Email Verification UI
const VerificationUI = {
    create() {
        const verificationHTML = `
            <div id="verificationSection" class="auth-container">
                <div class="auth-form">
                    <div class="verification-icon">📧</div>
                    <h2>אמת את כתובת המייל שלך</h2>
                    <p class="verification-message">
                        שלחנו הודעת אימות לכתובת: <strong id="verificationEmail"></strong>
                    </p>
                    <p class="verification-instructions">
                        📋 <strong>הוראות:</strong><br>
                        1. בדוק את המייל שלך (כולל תיקיית הספאם)<br>
                        2. לחץ על קישור האימות במייל<br>
                        3. לאחר האימות תופנה למסך ההתחברות<br>
                        4. התחבר עם המייל והסיסמה שלך<br><br>
                        <em>💡 אם כבר אימתת את המייל, לחץ על "חזור למסך התחברות"</em>
                    </p>
                    <div class="verification-actions">
                        <button type="button" id="backToLoginBtn" class="btn btn-primary">
                            🔙 חזור למסך התחברות
                        </button>
                        <button type="button" id="resendVerificationBtn" class="btn btn-secondary">
                            📤 שלח מייל חוזר
                        </button>
                        <button type="button" id="refreshStatusBtn" class="btn btn-secondary">
                            🔄 בדוק מצב אימות
                        </button>
                        <button type="button" id="logoutFromVerificationBtn" class="btn btn-danger">
                            🚪 התנתק
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        DOM.authSection.insertAdjacentHTML('afterend', verificationHTML);
        DOM.verificationSection = document.getElementById('verificationSection');
        
        this.setupEventListeners();
    },

    setupEventListeners() {
        const backToLoginBtn = document.getElementById('backToLoginBtn');
        const resendBtn = document.getElementById('resendVerificationBtn');
        const refreshStatusBtn = document.getElementById('refreshStatusBtn');
        const logoutBtn = document.getElementById('logoutFromVerificationBtn');
        
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', () => {
                // Already signed out, just go back to login
                NavigationUI.showAuthSection();
                MessageManager.info('חזרת למסך ההתחברות. לאחר אימות המייל תוכל להתחבר.');
            });
        }
        
        if (refreshStatusBtn) {
            refreshStatusBtn.addEventListener('click', async () => {
                MessageManager.info('מכיוון שנתקת מהמערכת, אנא התחבר כדי לבדוק את מצב האימות.');
                NavigationUI.showAuthSection();
            });
        }
        
        if (resendBtn) {
            resendBtn.addEventListener('click', () => EmailResend.handle());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                // Already signed out, just go to auth section
                NavigationUI.showAuthSection();
                MessageManager.info('חזרת למסך ההתחברות.');
            });
        }
    }
}; 