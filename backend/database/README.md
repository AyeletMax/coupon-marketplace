# מסד הנתונים – הסבר קצר

## למה שתי טבלאות?

- **products** – מידע ששייך לכל מוצר (שם, תיאור, תמונה, סוג). בעתיד יכול להיות גם מוצר מסוג אחר (לא קופון).
- **coupons** – מידע ששייך רק לקופון: מחיר עלות, מרווח, האם נמכר, והערך (בarcode/QR). כל שורה ב־coupons מקושרת ל־שורה אחת ב־products דרך `product_id`.

## שדות חשובים

| טבלה   | שדה                | משמעות |
|--------|--------------------|--------|
| products | id, name, type   | מזהה, שם, סוג (כרגע רק COUPON) |
| products | image_url        | חובה – קישור לתמונה |
| coupons  | cost_price       | מחיר עלות – רק אדמין קובע |
| coupons  | margin_percentage| אחוז מרווח – רק אדמין קובע |
| coupons  | minimum_sell_price | מחיר מינימלי למכירה – **מחושב בשרת** (לא נשמר מהלקוח) |
| coupons  | is_sold          | האם הקופון כבר נמכר |
| coupons  | value_type, value| הערך של הקופון – **מוחזר רק אחרי רכישה** |

## איך מריצים את הסכמה? (שלב 2b)

1. וודאי ש־Docker Desktop רץ.
2. מהשורש של הפרויקט: `docker compose up -d`
3. חכי כמה שניות עד ש־MySQL מוכן.
4. מהשורש של הפרויקט, הרצת הסכמה (פעם אחת):

   **PowerShell (Windows):**
   ```powershell
   Get-Content .\backend\database\schema.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
   ```

   **Bash:**
   ```bash
   docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace < backend/database/schema.sql
   ```
   אחרי זה הטבלאות קיימות.
