// Comment Toggle Handler
const CommentToggler = {
    toggle(postId) {
        const commentsSection = document.getElementById(`comments-${postId}`);
        if (!commentsSection) return;
        
        const isHidden = commentsSection.classList.contains('hidden');
        
        if (isHidden) {
            commentsSection.classList.remove('hidden');
            CommentLoader.load(postId);
        } else {
            commentsSection.classList.add('hidden');
        }
    }
}; 