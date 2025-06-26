// Like Toggle Handler - Uses likes table
const LikeToggler = {
    async toggle(postId) {
        if (!(await EmailVerificationGuard.ensure())) return;

        if (!postId || !AppState.currentUser?.id) {
            MessageManager.error('שגיאה בנתונים');
            return;
        }

        try {
            // Check if user already liked this post
            const { data: existingLike } = await supabase
                .from('likes')
                .select('id')
                .eq('post_id', postId)
                .eq('user_id', AppState.currentUser.id)
                .single();

            if (existingLike) {
                await LikeRemover.remove(postId);
            } else {
                await LikeAdder.add(postId);
            }

            await LikeCounter.update(postId);
        } catch (error) {
            console.error('Like toggle error:', error);
            MessageManager.error('שגיאה בעדכון הלייק');
        }
    }
}; 