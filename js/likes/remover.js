// Like Remover - Deletes from likes table
const LikeRemover = {
    async remove(postId) {
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', AppState.currentUser.id);

        if (error) {
            console.error('Like remove error:', error);
            throw error;
        }
    }
}; 