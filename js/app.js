// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // בדיקה מוקדמת: אם יש פרמטרי אימות Supabase ב-URL
        const urlParams = new URLSearchParams(window.location.search);
        const hasSupabaseAuthParams = urlParams.has('type') || urlParams.has('token') || urlParams.has('token_hash');
        
        if (hasSupabaseAuthParams) {
            console.log('🔗 זוהו פרמטרי אימות Supabase - מציג מסך ומעבד ברקע');
            
            // מיד הצג את מסך האימות (חוויית משתמש מהירה)
            showEmailVerificationProcessScreen();
            
            // בדוק שהאתחול עבר בהצלחה
            const initSupabaseSuccess = await initializeSupabaseComponents();
            
            if (initSupabaseSuccess) {
                showEmailVerificationSuccessScreen();
            } else {
                // הצג מסך שגיאה
                console.log ('initializeSupabaseComponents failed');
                document.body.innerHTML = `
                    <div style="text-align: center; padding: 50px; font-family: Arial; background: #f5f5f5; min-height: 100vh;">
                        <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;">
                            <h1 style="color: #dc3545;">❌ שגיאה באתחול</h1>
                            <p style="font-size: 18px; margin: 20px 0;">לא ניתן היה לאתחל את המערכת כראוי.</p>
                            
                            <button onclick="closeVerificationScreen()" style="
                                background: #dc3545; 
                                color: white; 
                                border: none; 
                                padding: 15px 30px; 
                                font-size: 16px; 
                                border-radius: 5px; 
                                cursor: pointer;
                                margin-top: 20px;
                            ">
                                סגור
                            </button>
                        </div>
                    </div>
                `;
            }
            
            return; // עצור את טעינת האפליקציה
        }
        
         await initializeSupabaseComponents();
        
      
        
        console.log('✅ SharingNet App Initialized');
    } catch (error) {
        console.error('Error initializing app:', error);
        MessageManager.error('שגיאה בטעינת האפליקציה');
    }
});

// פונקציה להצגת מסך תהליך אימות מייל
function showEmailVerificationProcessScreen() {
    console.log('🔗 מציג מסך התחלת אימות מייל');
    
    document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: Arial; background: #f5f5f5; min-height: 100vh;">
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;">
                <h1 style="color: #007bff;">📧 אימות המייל התחיל</h1>
                <p style="font-size: 18px; margin: 20px 0;">תהליך אימות המייל החל במערכת.</p>
                
                <div style="background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold; color: #155724;">
                        המערכת מעבדת את בקשת האימות
                    </p>
                </div>
                
                <button onclick="closeVerificationScreen()" style="
                    background: #dc3545; 
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    font-size: 16px; 
                    border-radius: 5px; 
                    cursor: pointer;
                    margin-top: 20px;
                ">
                    סגור מסך זה
                </button>
            </div>
        </div>
    `;
}

// פונקציה להצגת מסך הצלחת אימות מייל
function showEmailVerificationSuccessScreen() {
    console.log('🔗 מציג מסך הצלחת אימות מייל');
    
    document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: Arial; background: #f5f5f5; min-height: 100vh;">
            <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;">
                <h1 style="color: #28a745;">✅ אימות המייל בוצע בהצלחה!</h1>
                <p style="font-size: 18px; margin: 20px 0;">המייל שלך אומת במערכת בהצלחה.</p>
                
                <div style="background: #d4edda; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
                    <p style="margin: 0; font-weight: bold; color: #155724;">
                        ✨ תוכל כעת להתחבר לאפליקציה!
                    </p>
                </div>
                
                <button onclick="closeVerificationScreen()" style="
                    background: #28a745; 
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    font-size: 16px; 
                    border-radius: 5px; 
                    cursor: pointer;
                    margin-top: 20px;
                ">
                    סגור וחזור לאפליקציה
                </button>
            </div>
        </div>
    `;
}

// פונקציה לסגירת מסך האימות
function closeVerificationScreen() {
    console.log('🔗 סוגר מסך אימות מייל');
    window.close();
    
    // אם window.close() לא עובד (בדפדפנים מסוימים), נציג הודעה
    setTimeout(() => {
        if (!window.closed) {
            console.log('🔗 לא ניתן לסגור חלון אוטומטית - מציג הודעה');
            document.body.innerHTML = `
                <div style="text-align: center; padding: 50px; font-family: Arial;">
                    <h2>אנא סגור חלון זה ידנית</h2>
                    <p>לחץ על X בפינת החלון או Ctrl+W</p>
                </div>
            `;
        }
    }, 1000);
} 