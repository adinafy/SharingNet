# SharingNet - רשת חברתית פשוטה

רשת חברתית פשוטה ומודרנית עם פונקציונאליות בסיסית שנבנתה עם HTML, CSS, JavaScript ו-Supabase.

## תכונות

- **הרשמה והתחברות עם אימות מייל** - ניהול משתמשים מאובטח עם אימות אימייל מלא
- **יצירת פוסטים** - משתמשים יכולים לשתף מחשבות ותוכן
- **לייקים** - אפשרות לחבב פוסטים של משתמשים אחרים
- **תגובות** - תגיבו על פוסטים והתקשרו עם המשתמשים
- **עיצוב רספונסיבי** - עובד מושלם על כל המכשירים
- **ממשק בעברית** - תמיכה מלאה בכיוון RTL
- **ארכיטקטורה מודולרית** - קוד מאורגן במודולים נפרדים לתחזוקה קלה

## התקנה והגדרה

### 1. שכפלו את הפרויקט
```bash
git clone <repository-url>
cd SharingNet
```

### 2. הגדרת Supabase

#### א. יצירת פרויקט Supabase
1. יצרו חשבון ב-[Supabase](https://supabase.com)
2. צרו פרויקט חדש
3. העתיקו את ה-URL וה-Anon Key

#### ב. הגדרת התצורה
1. העתיקו את הקובץ:
   ```bash
   cp js/core/config.example.js js/core/config.js
   ```
2. ערכו את `js/core/config.js` והחליפו את הערכים:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';
   ```

#### ג. הגדרת מסד הנתונים
1. פתחו את ה-SQL Editor ב-Supabase
2. הריצו את הקובץ `database_setup.sql` (מומלץ)
   - או בחלופה: הריצו את הטבלאות ידנית (ראו למטה)

### 3. הגדרות Authentication ב-Supabase

1. **עברו ל-Authentication > Settings**
2. **הגדירו אימות מייל:**
   - **הפעילו** את "Enable email confirmations" (מומלץ לאבטחה)
   - או **בטלו** לכניסה מיידית ללא אימות
3. **הגדירו Site URL** לכתובת האתר שלכם (למשל: `https://yoursite.vercel.app`)
4. **הגדירו Redirect URLs** - **חשוב מאוד!**:
   - הוסיפו את אותה כתובת כמו ה-Site URL
   - זה יבטיח שלאחר אימות המייל המשתמש יחזור לאפליקציה שלכם
   - דוגמה: `https://yoursite.vercel.app`

### 4. הפעלת האפליקציה
- פתחו את `index.html` בדפדפן
- או השתמשו בשרת מקומי כמו Live Server ב-VS Code
- לצפייה בדמו: פתחו את `demo.html`

## מבנה הפרויקט

```
SharingNet/
├── index.html                    # מבנה HTML ראשי
├── demo.html                     # דף דמו והסבר
├── styles.css                    # עיצוב CSS
├── database_setup.sql            # הגדרת מסד נתונים אוטומטית
├── clear_existing_data.sql       # ניקוי נתונים קיימים
├── README.md                     # מסמך זה
└── js/                          # קבצי JavaScript מודולריים
    ├── app.js                   # אתחול האפליקציה הראשי
    ├── core/                    # מודולי ליבה
    │   ├── config.example.js    # תבנית הגדרות
    │   ├── config.js           # הגדרות (יש ליצור)
    │   ├── dom-elements.js     # ניהול אלמנטי DOM
    │   └── state.js            # ניהול מצב האפליקציה
    ├── auth/                   # מודולי אימות
    │   ├── login.js           # התחברות
    │   ├── register.js        # הרשמה
    │   ├── logout.js          # התנתקות
    │   └── session-checker.js # בדיקת סשן
    ├── email/                 # מודולי אימות מייל
    │   ├── confirmation-handler.js  # טיפול באישור מייל
    │   ├── resend.js              # שליחה מחדש
    │   ├── verification-checker.js # בדיקת אימות
    │   └── verification-guard.js   # הגנת אימות
    ├── ui/                    # מודולי ממשק משתמש
    │   ├── auth-tabs.js       # טאבי אימות
    │   ├── navigation.js      # ניווט
    │   └── verification-section.js # סקציית אימות
    ├── posts/                 # מודולי פוסטים
    │   ├── creator.js         # יצירת פוסטים
    │   ├── loader.js          # טעינת פוסטים
    │   ├── renderer.js        # רנדור פוסטים
    │   └── element-builder.js # בניית אלמנטים
    ├── likes/                 # מודולי לייקים
    │   ├── toggler.js         # החלפת מצב לייק
    │   ├── adder.js          # הוספת לייק
    │   ├── remover.js        # הסרת לייק
    │   └── counter.js        # ספירת לייקים
    ├── comments/              # מודולי תגובות
    │   ├── toggler.js         # החלפת מצב תגובות
    │   ├── loader.js          # טעינת תגובות
    │   ├── element-builder.js # בניית אלמנטי תגובות
    │   ├── adder.js          # הוספת תגובות
    │   └── counter.js        # ספירת תגובות
    └── utils/                 # כלי עזר
        ├── loading.js         # ניהול טעינה
        ├── messages.js        # הודעות למשתמש
        └── time.js           # פונקציות זמן
```

## הגדרת מסד הנתונים (אם לא השתמשתם בקובץ SQL)

### 1. טבלת `profiles`
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
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

-- Enable RLS + Policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE TO authenticated USING (auth.uid() = user_id);
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

-- Enable RLS + Policies
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create likes" ON likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE TO authenticated USING (auth.uid() = user_id);
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

-- Enable RLS + Policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

## שימוש

### אימות מייל מופעל (מומלץ):
1. **הרשמה**: צרו חשבון → **המערכת מתנתקת אוטומטית** → מסך אימות מוצג
2. **אימות מייל**: בדקו את המייל → לחצו על קישור האימות
3. **התחברות**: חזרו למסך ההתחברות → התחברו עם הפרטים שלכם

### אימות מייל מבוטל:
1. **הרשמה מיידית**: צרו חשבון וכנסו מיד ללא אימות מייל
2. **התחברות**: התחברו עם הפרטים שלכם

### פעולות באפליקציה:
3. **יצירת פוסט**: כתבו בקופסת "מה חדש?" ולחצו "שתף"
4. **לייק לפוסט**: לחצו על כפתור הלב ❤️
5. **תגובה**: לחצו על כפתור התגובות 💬 וכתבו תגובה
6. **התנתקות**: לחצו על כפתור "התנתק" בפינה הימנית העליונה

## ארכיטקטורה טכנית

- **מודולרית**: כל תכונה בקבצים נפרדים לתחזוקה קלה
- **מצב מרכזי**: ניהול מצב האפליקציה דרך `AppState`
- **DOM מוקש**: אלמנטי DOM נשמרים ב-cache ל-performance
- **אסינכרוני**: פעולות מסד הנתונים עם async/await
- **אבטחה**: Row Level Security (RLS) בכל הטבלאות
- **ניהול Sessions**: התנתקות אוטומטית אחרי הרשמה למניעת בעיות הרשאות
- **UX/UI**: הודעות למשתמש, טעינות, ואנימציות

## דרישות מערכת

- דפדפן מודרני עם תמיכה ב-ES6+
- חיבור לאינטרנט יציב
- חשבון Supabase פעיל
- HTTPS למערכות production (נדרש ל-Supabase)

## פתרון בעיות נפוצות

### שגיאות הגדרה:
1. **ודאו שקובץ `config.js` קיים** עם המפתחות הנכונים
2. **בדקו שהטבלאות נוצרו** ב-Supabase
3. **ודאו שה-RLS מופעל** וה-Policies הוגדרו
4. **בדקו את ה-Console** בדפדפן להודעות שגיאה
5. **התנתקות אחרי הרשמה** - זו התנהגות רגילה! המערכת מתנתקת אוטומטית למניעת בעיות

### בעיות אימות מייל:
1. **בדקו בתיקיית הספאם** את מייל האימות
2. **ודאו שה-Site URL נכון** ב-Authentication Settings
3. **ודאו שה-Redirect URLs מוגדרים נכון** - זה חיוני!
4. **השתמשו ב-HTTPS** למערכות production
5. **אם נפתחים מספר מסכים לאחר אימות** - המערכת תנקה אוטומטית את המסכים הישנים
6. **אם נתקעת במסך אימות** - לחץ על "בדוק מצב אימות" או "חזור למסך התחברות"
7. **הזרימה הנכונה**: הרשמה → התנתקות אוטומטית → בדיקת מייל → לחיצה על קישור → חזרה למסך התחברות → התחברות

### בעיות ביצועים:
1. **נקו נתונים ישנים** עם `clear_existing_data.sql`
2. **בדקו חיבור אינטרנט** יציב
3. **ודאו שה-Database** לא מלא

## פיתוח והרחבה

הפרויקט מאורגן למודולים עצמאיים:
- **להוספת תכונות חדשות**: צרו מודול חדש בתיקייה המתאימה
- **לשינוי עיצוב**: ערכו את `styles.css`
- **להוספת טבלאות**: הוסיפו ל-`database_setup.sql`

## רישיון

פרויקט זה הוא קוד פתוח ומיועד למטרות חינוכיות ופיתוח אישי. 