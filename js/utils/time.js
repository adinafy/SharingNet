// Time Utility Functions
const TimeUtils = {
    getTimeAgo(date) {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) {
            return 'עכשיו';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `לפני ${minutes} ${this.pluralize(minutes, 'דקה', 'דקות')}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `לפני ${hours} ${this.pluralize(hours, 'שעה', 'שעות')}`;
        } else if (diffInSeconds < 2592000) { // 30 days
            const days = Math.floor(diffInSeconds / 86400);
            return `לפני ${days} ${this.pluralize(days, 'יום', 'ימים')}`;
        } else {
            return past.toLocaleDateString('he-IL');
        }
    },

    pluralize(count, singular, plural) {
        return count === 1 ? singular : plural;
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}; 