// Comment Loader - Fetches from comments table
const CommentLoader = {
    async load(postId) {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const commentsList = document.getElementById(`comments-list-${postId}`);
            if (!commentsList) return;

            commentsList.innerHTML = '';

            data.forEach(comment => {
                const commentEl = CommentElementBuilder.create(comment);
                commentsList.appendChild(commentEl);
            });
        } catch (error) {
            console.error('Comment load error:', error);
            MessageManager.error('שגיאה בטעינת התגובות: ' + (error.message || 'שגיאה לא ידועה'));
        }
    }
}; 