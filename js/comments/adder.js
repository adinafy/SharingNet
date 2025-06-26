// Comment Adder - Inserts into comments table
const CommentAdder = {
    async add(postId) {
        if (!(await EmailVerificationGuard.ensure())) return;
        
        const commentInput = document.getElementById(`comment-input-${postId}`);
        if (!commentInput) return;
        
        const content = commentInput.value.trim();
        if (!content) {
            MessageManager.warning('אנא כתוב תגובה');
            return;
        }

        try {
            const { error } = await supabase
                .from('comments')
                .insert([
                    {
                        content,
                        post_id: postId,
                        user_id: AppState.currentUser.id,
                        user_name: AppState.getUserDisplayName(),
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            commentInput.value = '';
            await CommentLoader.load(postId);
            await CommentCounter.update(postId);
        } catch (error) {
            console.error('Comment add error:', error);
            MessageManager.error('שגיאה בהוספת תגובה: ' + (error.message || 'שגיאה לא ידועה'));
        }
    }
}; 