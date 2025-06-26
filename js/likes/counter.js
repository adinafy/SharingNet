// Like Counter - Counts from likes table
const LikeCounter = {
    async update(postId) {
        try {
            // Get total likes count
            const { data: likes, error } = await supabase
                .from('likes')
                .select('id')
                .eq('post_id', postId);

            if (error) {
                console.error('Like count error:', error);
                return;
            }

            const likeBtn = document.querySelector(`[data-post-id="${postId}"] .like-btn`);
            if (!likeBtn) return;

            const likeCount = likeBtn.querySelector('.like-count');
            if (likeCount) {
                likeCount.textContent = likes.length;
            }

            // Check if current user liked this post
            const { data: userLike } = await supabase
                .from('likes')
                .select('id')
                .eq('post_id', postId)
                .eq('user_id', AppState.currentUser.id)
                .single();

            if (userLike) {
                likeBtn.classList.add('liked');
            } else {
                likeBtn.classList.remove('liked');
            }
        } catch (error) {
            console.error('Like counter error:', error);
        }
    }
}; 