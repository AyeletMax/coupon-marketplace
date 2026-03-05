# Frontend Structure

## 📁 Directory Structure

```
frontend/src/
├── components/         # כל הקומפוננטות (גדולות וקטנות)
│   ├── AdminView.jsx       → קומפוננטה ראשית - מסך אדמין
│   ├── CustomerView.jsx    → קומפוננטה ראשית - מסך לקוח
│   ├── CouponCard.jsx      → קומפוננטה - כרטיס קופון
│   ├── CouponGrid.jsx      → קומפוננטה - רשת קופונים
│   ├── ModeHeader.jsx      → קומפוננטה - כותרת עם בחירת מצב
│   └── PurchaseResult.jsx  → קומפוננטה - הודעת הצלחה
├── styles/            # קבצי CSS (קובץ לכל קומפוננטה)
│   ├── AdminView.css
│   ├── CustomerView.css
│   ├── CouponCard.css
│   ├── CouponGrid.css
│   ├── ModeHeader.css
│   ├── PurchaseResult.css
│   └── App.css
├── api/               # קריאות API
│   └── customerApi.js
├── App.jsx            # קומפוננטת שורש
├── main.jsx           # נקודת כניסה
└── index.css          # סטיילים גלובליים
```

## 🎯 Component Hierarchy

```
App.jsx (קומפוננטת שורש)
  ├── ModeHeader (בחירת מצב)
  └── CustomerView / AdminView (קומפוננטות ראשיות)
       └── CouponGrid
            └── CouponCard (x N)
```

## 📝 Naming Conventions

### קומפוננטות
- **PascalCase** לשמות קבצים: `CouponCard.jsx`
- **PascalCase** לשמות פונקציות: `function CouponCard() {}`

### CSS Classes
- **BEM methodology** (Block Element Modifier):
  - Block: `.coupon-card`
  - Element: `.coupon-card__title`
  - Modifier: `.mode-button--active`

### קבצי CSS
- שם זהה לקומפוננטה: `CouponCard.jsx` → `CouponCard.css`
- import בתחילת הקומפוננטה: `import '../styles/CouponCard.css'`

## ✨ Guidelines

1. **הפרדת אחריות:**
   - קומפוננטות ראשיות (CustomerView, AdminView) - עם state ולוגיקה
   - קומפוננטות עזר (CouponCard, CouponGrid) - פשוטות ולשימוש חוזר
   - כל העיצוב בקבצי CSS נפרדים

2. **סטיילים:**
   - ✅ קובץ CSS נפרד לכל קומפוננטה
   - ✅ BEM naming convention
   - ❌ אין inline styles (אלא אם כן דינמי, כמו `backgroundImage`)

3. **קוד נקי:**
   - כל קומפוננטה בקובץ נפרד
   - props ברורים ומתועדים
   - קוד קריא ומסודר
