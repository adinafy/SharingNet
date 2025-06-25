# SharingNet - רשת חברתית פשוטה

רשת חברתית פשוטה ומודרנית עם פונקציונאליות בסיסית שנבנתה עם HTML, CSS, JavaScript ו-Supabase.

## תכונות

- **הרשמה והתחברות מיידית** - ניהול משתמשים מאובטח ללא צורך באימות מייל
- **יצירת פוסטים** - משתמשים יכולים לשתף מחשבות ותוכן
- **לייקים** - אפשרות לחבב פוסטים של משתמשים אחרים
- **תגובות** - תגיבו על פוסטים והתקשרו עם המשתמשים
- **עיצוב רספונסיבי** - עובד מושלם על כל המכשירים
- **ממשק בעברית** - תמיכה מלאה בכיוון RTL

## התקנה

1. **שכפלו את הפרויקט**
   ```bash
   git clone <repository-url>
   cd SharingNet
   ```

2. **פתחו את index.html בדפדפן**
   - פשוט לפתוח את הקובץ בדפדפן המועדף עליכם
   - או להשתמש בשרת מקומי כמו Live Server ב-VS Code

## הגדרת Supabase

כדי שהאפליקציה תעבוד, תצטרכו ליצור את הטבלאות הבאות ב-Supabase:

### 1. טבלת `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to see all profiles
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);
```

### 2. טבלת `posts`
```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy for everyone to see posts
CREATE POLICY "Posts are viewable by everyone"
ON posts FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to create posts
CREATE POLICY "Users can create posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own posts
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to delete their own posts
CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 3. טבלת `likes`
```sql
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Policy for everyone to see likes
CREATE POLICY "Likes are viewable by everyone"
ON likes FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to create likes
CREATE POLICY "Users can create likes"
ON likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own likes
CREATE POLICY "Users can delete their own likes"
ON likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

### 4. טבלת `comments`
```sql
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy for everyone to see comments
CREATE POLICY "Comments are viewable by everyone"
ON comments FOR SELECT
TO authenticated
USING (true);

-- Policy for authenticated users to create comments
CREATE POLICY "Users can create comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own comments
CREATE POLICY "Users can update their own comments"
ON comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to delete their own comments
CREATE POLICY "Users can delete their own comments"
ON comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
```

## הגדרות Authentication ב-Supabase

1. **עברו ל-Authentication > Settings**
2. **בטלו אימות מייל:**
   - בטלו את הסימון של **"Enable email confirmations"**
   - זה יאפשר למשתמשים להתחבר מיד לאחר הרשמה
3. **הגדירו Site URL** לכתובת האתר שלכם (למשל: `http://localhost:3000` לפיתוח מקומי)
4. **הגדירו Redirect URLs** אם נדרש

## שימוש

1. **הרשמה מיידית**: צרו חשבון חדש עם שם, אימייל וסיסמה - מעבר אוטומטי לאפליקציה
2. **התחברות**: התחברו עם הפרטים שלכם
3. **יצירת פוסט**: כתבו משהו בקופסת "מה חדש?" ולחצו "שתף"
4. **לייק לפוסט**: לחצו על כפתור הלב
5. **תגובה**: לחצו על כפתור התגובות וכתבו תגובה
6. **התנתקות**: לחצו על כפתור "התנתק" בפינה הימנית העליונה

**💡 טיפ**: אין צורך לבדוק מייל או לאמת חשבון - ההרשמה מיידית!

## מבנה הפרויקט

```
SharingNet/
├── index.html      # מבנה HTML ראשי
├── styles.css      # עיצוב CSS
├── script.js       # לוגיקת JavaScript
└── README.md       # מסמך זה
```

## דרישות מערכת

- דפדפן מודרני עם תמיכה ב-ES6+
- חיבור לאינטרנט
- חשבון Supabase פעיל

## תמיכה טכנית

אם נתקלתם בבעיות:
1. ודאו שהטבלאות נוצרו נכון ב-Supabase
2. בדקו שה-RLS מופעל וה-Policies הוגדרו
3. ודאו שה-API keys נכונים בקובץ script.js
4. בדקו את ה-Console בדפדפן להודעות שגיאה

## רישיון

פרויקט זה הוא קוד פתוח ומיועד למטרות חינוכיות. 