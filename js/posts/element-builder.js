// Post Element Builder
const PostElementBuilder = {
    create(post) {
        const timeAgo = TimeUtils.getTimeAgo(post.created_at);
        const userInitial = post.user_name ? post.user_name.charAt(0).toUpperCase() : 'U';

        const postEl = document.createElement('div');
        postEl.className = 'post-card';
        postEl.dataset.postId = post.id;

        postEl.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">${userInitial}</div>
                <div class="post-info">
                    <h4>${post.user_name || 'משתמש'}</h4>
                    <span class="post-time">${timeAgo}</span>
                </div>
            </div>
            <div class="post-content">${this.escapeHtml(post.content)}</div>
            <div class="post-actions-bar">
                <button class="action-btn like-btn" onclick="LikeToggler.toggle('${post.id}')">
                    <i class="fas fa-heart"></i>
                    <span class="like-count">0</span>
                </button>
                <button class="action-btn comment-btn" onclick="CommentToggler.toggle('${post.id}')">
                    <i class="fas fa-comment"></i>
                    <span class="comment-count">0</span>
                </button>
            </div>
            <div class="comments-section hidden" id="comments-${post.id}">
                <div class="comment-form">
                    <input type="text" class="comment-input" placeholder="כתוב תגובה..." id="comment-input-${post.id}">
                    <button class="comment-btn" onclick="CommentAdder.add('${post.id}')">שלח</button>
                </div>
                <div class="comments-list" id="comments-list-${post.id}">
                    <!-- Comments will be loaded here -->
                </div>
            </div>
        `;

        return postEl.outerHTML;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};