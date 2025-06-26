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
                        נשלח לך מייל עם קישור אימות. לחץ על הקישור במייל כדי להמשיך.
                    </p>
                    <div class="verification-actions">
                        <button type="button" id="resendVerificationBtn" class="btn btn-secondary">
                            📤 שלח מייל חוזר
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
        const resendBtn = document.getElementById('resendVerificationBtn');
        const logoutBtn = document.getElementById('logoutFromVerificationBtn');
        
        if (resendBtn) {
            resendBtn.addEventListener('click', () => EmailResend.handle());
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => UserLogout.handle());
        }
    }
}; 