// Post Creation Handler - Inserts into posts table
const PostCreator = {
    async handle(e) {
        e.preventDefault();
        
        if (!(await EmailVerificationGuard.ensure())) return;
        
        const contentInput = DOM.getPostContent();
        if (!contentInput) {
            MessageManager.error('שדה התוכן לא נמצא');
            return;
        }

        const content = contentInput.value.trim();
        if (!content) {
            MessageManager.warning('אנא כתוב משהו בפוסט');
            return;
        }

        await LoadingManager.wrap(async () => {
            try {
                // Insert into posts table with user_name from profile
                const { data, error } = await supabase
                    .from('posts')
                    .insert([
                        {
                            content,
                            user_id: AppState.currentUser.id,
                            user_name: AppState.getUserDisplayName(),
                            created_at: new Date().toISOString()
                        }
                    ])
                    .select();

                if (error) throw error;

                contentInput.value = '';
                await PostLoader.load();
                MessageManager.success('הפוסט נוצר בהצלחה!');
            } catch (error) {
                console.error('Post creation error:', error);
                MessageManager.error(error.message || 'שגיאה ביצירת הפוסט');
            }
        });
    },

    init() {
        if (DOM.createPostForm) {
            DOM.createPostForm.addEventListener('submit', (e) => this.handle(e));
        }
    }
}; 