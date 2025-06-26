// Comment Element Builder
const CommentElementBuilder = {
    create(comment) {
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';

        const timeAgo = TimeUtils.getTimeAgo(comment.created_at);
        const userInitial = comment.user_name ? comment.user_name.charAt(0).toUpperCase() : 'U';

        commentEl.innerHTML = `
            <div class="comment-avatar">${userInitial}</div>
            <div class="comment-content">
                <div class="comment-author">${comment.user_name || 'משתמש'}</div>
                <div class="comment-text">${this.escapeHtml(comment.content)}</div>
                <div class="comment-time">${timeAgo}</div>
            </div>
        `;

        return commentEl;
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}; 