// Like Adder - Inserts into likes table
const LikeAdder = {
    async add(postId) {
        const { error } = await supabase
            .from('likes')
            .insert([
                {
                    post_id: postId,
                    user_id: AppState.currentUser.id,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error('Like add error:', error);
            throw error;
        }
    }
}; 