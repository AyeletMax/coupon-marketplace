# Setup Instructions

## 🚀 Quick Start with Docker (Recommended)

### Step 1: Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Make sure Docker Desktop is running

### Step 2: Clone & Setup
```bash
git clone <your-repo-url>
cd coupon-marketplace
cp env.example .env
```

### Step 3: Start Everything
```bash
docker compose up -d --build
```

Wait 30-60 seconds for all services to start.

### Step 4: Access
- **Frontend:** http://localhost
- **Backend API:** http://localhost:3000
- **Health Check:** http://localhost:3000/health

### Step 5: Test
1. Open http://localhost
2. Click "Customer" - you should see 5 sample coupons
3. Click "Admin" - you can create/edit/delete coupons
4. Try purchasing a coupon!

---

## 🛠️ Development Setup (Local)

### Prerequisites
- Node.js 18+
- Docker (for MySQL only)

### Step 1: Start MySQL
```bash
docker compose up mysql -d
```

### Step 2: Initialize Database

**Windows (PowerShell):**
```powershell
Get-Content .\backend\database\schema.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
Get-Content .\backend\database\sample-data.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
```

**Linux/Mac:**
```bash
docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace < backend/database/schema.sql
docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace < backend/database/sample-data.sql
```

### Step 3: Start Backend
```bash
cd backend
npm install
npm run dev
```

### Step 4: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Access
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## 🧪 Testing the Reseller API

### Get Products
```bash
curl -H "Authorization: Bearer secret-reseller-token" \
     http://localhost:3000/api/v1/products
```

### Purchase Product
```bash
curl -X POST \
     -H "Authorization: Bearer secret-reseller-token" \
     -H "Content-Type: application/json" \
     -d '{"reseller_price": 120.00}' \
     http://localhost:3000/api/v1/products/{product-id}/purchase
```

---

## 🔧 Troubleshooting

### "Port already in use"
Edit `.env` and change ports:
```env
MYSQL_PORT=3308
PORT=3001
```

### "Cannot connect to database"
```bash
# Check MySQL is running
docker ps

# View logs
docker logs coupon-marketplace-db

# Restart
docker compose restart mysql
```

### "Frontend shows blank page"
```bash
# Check backend is running
curl http://localhost:3000/health

# Should return: {"status":"ok","database":"connected"}
```

---

## 🧹 Clean Up

### Stop services
```bash
docker compose down
```

### Remove all data
```bash
docker compose down -v
```

### Remove images
```bash
docker compose down --rmi all -v
```
