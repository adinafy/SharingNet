// Comment Counter - Counts from comments table
const CommentCounter = {
    async update(postId) {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('id')
                .eq('post_id', postId);

            if (error) {
                console.error('Comment count error:', error);
                return;
            }

            const commentBtn = document.querySelector(`[data-post-id="${postId}"] .comment-btn`);
            if (!commentBtn) return;

            const commentCount = commentBtn.querySelector('.comment-count');
            if (commentCount) {
                commentCount.textContent = data.length;
            }
        } catch (error) {
            console.error('Comment counter error:', error);
        }
    }
}; 