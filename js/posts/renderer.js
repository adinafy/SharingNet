// Post Renderer
const PostRenderer = {
    async render() {
        if (!DOM.postsContainer) {
            console.error('Posts container not found');
            return;
        }

        if (!AppState.posts.length) {
            DOM.postsContainer.innerHTML = '<p class="no-posts">אין פוסטים עדיין. בואו נתחיל!</p>';
            return;
        }

        try {
            const postsHTML = await Promise.all(
                AppState.posts.map(post => PostElementBuilder.create(post))
            );
            DOM.postsContainer.innerHTML = postsHTML.join('');
            
            // Initialize like and comment counts for each post
            for (const post of AppState.posts) {
                await LikeCounter.update(post.id);
                await CommentCounter.update(post.id);
            }
        } catch (error) {
            console.error('Error rendering posts:', error);
            MessageManager.error('שגיאה בהצגת הפוסטים');
        }
    }
}; 