-- מחיקת כל הנתונים מהטבלאות
-- הסדר חשוב בגלל foreign key constraints

-- מחיקת תגובות (תלוי בפוסטים ופרופילים)
DELETE FROM comments;

-- מחיקת לייקים (תלוי בפוסטים ופרופילים)
DELETE FROM likes;

-- מחיקת פוסטים (תלוי בפרופילים)
DELETE FROM posts;

-- מחיקת אימותי מייל (אם הטבלה קיימת)
DELETE FROM email_verifications;

-- מחיקת פרופילים (תלוי במשתמשי auth)
DELETE FROM profiles;

-- איפוס מונים אוטומטיים (auto-increment)
ALTER SEQUENCE comments_id_seq RESTART WITH 1;
ALTER SEQUENCE likes_id_seq RESTART WITH 1;
ALTER SEQUENCE posts_id_seq RESTART WITH 1;

-- הודעת סיום
SELECT 'כל הנתונים נמחקו בהצלחה!' as message; 