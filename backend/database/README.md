# Database Files

## 📁 Files:

### `schema.sql`
**Creates the database schema** – run once at the beginning.

- Table `products` – generic products
- Table `coupons` – coupon-specific details

### `sample-data.sql`
**Adds sample data** – 5 example coupons for testing:
- 🍕 Pizza Hut – ₪60
- 💆 Spa Treatment – ₪230
- 🎬 Cinema City – ₪100
- 🍽️ Fine Dining – ₪390
- 💪 Gym Membership – ₪480

## 🚀 How to run:

### 1. Create schema (once):
```powershell
Get-Content .\backend\database\schema.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
```

### 2. Insert sample data (optional):
```powershell
Get-Content .\backend\database\sample-data.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
```

### 3. Full reset (drop + recreate + sample data):
```powershell
Get-Content .\backend\database\schema.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
Get-Content .\backend\database\sample-data.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
```

## 💡 Tip:
If you want to completely reset the database, simply run both files in order.
