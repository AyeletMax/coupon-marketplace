# Coupon Marketplace

Backend exercise – digital coupon marketplace (Direct + Reseller API).

## Tech stack

- **Backend:** Node.js
- **Frontend:** React (Vite)
- **Database:** MySQL (to be added in Step 2)
- **Deployment:** Docker (to be added in Step 8)

## Project structure

```
coupon-marketplace/
├── backend/          # Node API (Admin + Reseller)
│   └── database/    # schema.sql, README
├── frontend/         # React app (Admin + Customer)
├── docker-compose.yml   # MySQL (Step 2b)
├── env.example      # דוגמה ל־.env – להעתיק ל־.env
├── .gitignore
└── README.md
```

## Database (Step 2b)

1. **Docker Desktop:** וודאי ש־Docker Desktop פתוח ורץ (ב־Windows – אחרת תקבלי שגיאה על `dockerDesktopLinuxEngine`). אם פורט 3306 תפוס (MySQL מקומי וכו') – ה־Compose משתמש ב־**3307** במחשב (ניתן לשנות ב־.env: `MYSQL_PORT=3307`).
2. **הגדרת משתנים:** העתיקי `env.example` לקובץ `.env` (בשורש הפרויקט). אפשר להשאיר את הערכים הדיפולטיביים לפיתוח.
3. **הרצת MySQL:**
   ```bash
   docker compose up -d
   ```
4. **הרצת הסכמה (פעם אחת):** אחרי שה־container רץ (כ־10–20 שניות):

   **ב־PowerShell (Windows):**
   ```powershell
   Get-Content .\backend\database\schema.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
   ```

   **ב־Bash (Linux/Mac/Git Bash):**
   ```bash
   docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace < backend/database/schema.sql
   ```
   (אם שינית סיסמה ב־.env, התאימי את `-u` ו־`-p`.)

## Run locally (after Step 1)

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs with Node `--watch` (no server yet – Step 2+).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens at http://localhost:5173 (placeholder page for now).

---

*README will be expanded in later steps (DB, API, Docker).*
