# Database Files

## 📁 קבצים:

### `schema.sql`
**יוצר את מבנה הטבלאות** - להריץ פעם אחת בהתחלה.

- טבלת `products` - מוצרים כלליים
- טבלת `coupons` - פרטי קופונים

### `sample-data.sql`
**מוסיף נתוני דוגמה** - 5 קופונים לבדיקה:
- 🍕 Pizza Hut - ₪60
- 💆 Spa Treatment - ₪230
- 🎬 Cinema City - ₪100
- 🍽️ Fine Dining - ₪390
- 💪 Gym Membership - ₪480

## 🚀 הרצה:

### 1. יצירת מבנה (פעם אחת):
```powershell
Get-Content .\backend\database\schema.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
```

### 2. הוספת נתונים (אופציונלי):
```powershell
Get-Content .\backend\database\sample-data.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
```

### 3. איפוס מלא (מחיקה + יצירה מחדש):
```powershell
Get-Content .\backend\database\schema.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
Get-Content .\backend\database\sample-data.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
```

## 💡 טיפ:
אם רוצה לאפס הכל ולהתחיל מחדש, פשוט הריצי את שני הקבצים לפי הסדר.
