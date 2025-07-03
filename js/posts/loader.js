// Post Loader - Fetches from posts table
const PostLoader = {
    async load() {
        // Only load posts for verified users
        if (!AppState.isEmailVerified) {
            console.log('📧 Skipping post loading - email not verified');
            return;
        }
        
        await LoadingManager.wrap(async () => {
            try {
                const { data, error } = await supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                AppState.setPosts(data || []);
                await PostRenderer.render();
                console.log('✅ Posts loaded successfully:', AppState.posts.length);
            } catch (error) {
                console.error('❌ Error loading posts:', error);
                MessageManager.error('שגיאה בטעינת הפוסטים: ' + (error.message || 'שגיאה לא ידועה'));
            }
        });
    }
};