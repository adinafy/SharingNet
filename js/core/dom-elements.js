// DOM Elements Cache
const DOM = {
    // Authentication elements
    authSection: document.getElementById('authSection'),
    verificationSection: null, // Created dynamically
    loginTab: document.getElementById('loginTab'),
    registerTab: document.getElementById('registerTab'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    
    // Main application elements
    mainApp: document.getElementById('mainApp'),
    userMenu: document.getElementById('userMenu'),
    userDisplayName: document.getElementById('userDisplayName'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Post-related elements
    createPostForm: document.getElementById('createPostForm'),
    postsContainer: document.getElementById('postsContainer'),
    
    // UI elements
    loadingSpinner: document.getElementById('loadingSpinner'),
    
    // Form input helpers
    getLoginEmail: () => document.getElementById('loginEmail'),
    getLoginPassword: () => document.getElementById('loginPassword'),
    getRegisterName: () => document.getElementById('registerName'),
    getRegisterEmail: () => document.getElementById('registerEmail'),
    getRegisterPassword: () => document.getElementById('registerPassword'),
    getPostContent: () => document.getElementById('postContent')
}; 