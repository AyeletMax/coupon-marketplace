# Coupon Marketplace

A digital coupon marketplace with Direct Customer and Reseller API channels.

## 📋 Overview

This application allows:
- **Admins** to create and manage digital coupons
- **Customers** to browse and purchase coupons at fixed prices
- **Resellers** to purchase coupons via REST API at flexible prices (≥ minimum)

## 🛠️ Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** React (Vite)
- **Database:** MySQL 8.0
- **Deployment:** Docker + Docker Compose

## 📁 Project Structure

```
coupon-marketplace/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── db.js          # Database connection
│   ├── database/
│   │   ├── schema.sql     # Database schema
│   │   └── sample-data.sql # Sample coupons
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── styles/        # CSS files
│   │   └── api/          # API calls
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Quick Start (Docker)

### Prerequisites
- Docker Desktop installed and running
- Git

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd coupon-marketplace
```

### 2. Create .env file
```bash
cp env.example .env
```

### 3. Start all services
```bash
docker compose up -d --build
```

This will start:
- **MySQL** on port 3307
- **Backend** on port 3000
- **Frontend** on port 80

### 4. Access the application

Open your browser: **http://localhost**

The database will be automatically initialized with sample data (5 coupons).

### 5. Stop services
```bash
docker compose down
```

### 6. Clean everything (including data)
```bash
docker compose down -v
```

---

## 💻 Local Development (without Docker)

### Prerequisites
- Node.js 18+
- MySQL 8.0 (or Docker for MySQL only)

### 1. Start MySQL
```bash
docker compose up mysql -d
```

### 2. Initialize database
**PowerShell (Windows):**
```powershell
Get-Content .\backend\database\schema.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
Get-Content .\backend\database\sample-data.sql -Raw | docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace
```

**Bash (Linux/Mac):**
```bash
docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace < backend/database/schema.sql
docker exec -i coupon-marketplace-db mysql -u app -papppassword coupon_marketplace < backend/database/sample-data.sql
```

### 3. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:3000

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

---

## 📡 API Documentation

### Admin API

Base URL: `/api/admin`

#### Create Coupon
```http
POST /api/admin/coupons
Content-Type: application/json

{
  "name": "Pizza Hut - Large Pizza",
  "description": "Family pizza + 1.5L drink",
  "image_url": "https://example.com/pizza.jpg",
  "cost_price": 50.00,
  "margin_percentage": 20.00,
  "value_type": "STRING",
  "value": "PIZZA-XYZ-12345"
}
```

#### Get All Coupons
```http
GET /api/admin/coupons
```

#### Update Coupon
```http
PUT /api/admin/coupons/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "cost_price": 55.00,
  ...
}
```

#### Delete Coupon
```http
DELETE /api/admin/coupons/{id}
```

---

### Customer API

Base URL: `/api/customer`

#### Get Available Coupons
```http
GET /api/customer/coupons
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "Pizza Hut - Large Pizza",
    "description": "Family pizza + 1.5L drink",
    "image_url": "https://...",
    "price": 60.00
  }
]
```

#### Purchase Coupon
```http
POST /api/customer/coupons/{id}/purchase
```

Response:
```json
{
  "product_id": "uuid",
  "final_price": 60.00,
  "value_type": "STRING",
  "value": "PIZZA-XYZ-12345"
}
```

---

### Reseller API

Base URL: `/api/v1`

**Authentication Required:** Bearer Token

```http
Authorization: Bearer secret-reseller-token
```

#### Get Available Products
```http
GET /api/v1/products
Authorization: Bearer secret-reseller-token
```

#### Get Product by ID
```http
GET /api/v1/products/{id}
Authorization: Bearer secret-reseller-token
```

#### Purchase Product
```http
POST /api/v1/products/{id}/purchase
Authorization: Bearer secret-reseller-token
Content-Type: application/json

{
  "reseller_price": 120.00
}
```

Response:
```json
{
  "product_id": "uuid",
  "final_price": 120.00,
  "value_type": "STRING",
  "value": "PIZZA-XYZ-12345"
}
```

**Error Codes:**
- `PRODUCT_NOT_FOUND` (404)
- `PRODUCT_ALREADY_SOLD` (409)
- `RESELLER_PRICE_TOO_LOW` (400)
- `UNAUTHORIZED` (401)

---

## 🎯 Features

### Admin Mode
- ✅ Create coupons with cost price and margin
- ✅ View all coupons
- ✅ Edit existing coupons
- ✅ Delete coupons
- ✅ Automatic price calculation (cost × (1 + margin%))

### Customer Mode
- ✅ Browse available coupons
- ✅ Purchase at fixed price (minimum_sell_price)
- ✅ Receive coupon code after purchase
- ✅ Real-time inventory updates

### Reseller API
- ✅ REST API with Bearer token authentication
- ✅ Purchase at flexible prices (≥ minimum)
- ✅ Atomic transactions
- ✅ Comprehensive error handling

---

## 🗄️ Database Schema

### products
```sql
id              UUID PRIMARY KEY
name            VARCHAR(255)
description     TEXT
type            ENUM('COUPON')
image_url       VARCHAR(500)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### coupons
```sql
product_id          UUID PRIMARY KEY (FK → products.id)
cost_price          DECIMAL(10,2)
margin_percentage   DECIMAL(5,2)
minimum_sell_price  DECIMAL(10,2) -- Calculated
is_sold             BOOLEAN
value_type          ENUM('STRING', 'IMAGE')
value               TEXT -- Coupon code (revealed after purchase)
```

---

## 🔒 Environment Variables

Create a `.env` file in the project root:

```env
# MySQL
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=coupon_marketplace
MYSQL_USER=app
MYSQL_PASSWORD=apppassword
MYSQL_PORT=3307

# Reseller API Token
RESELLER_TOKEN=secret-reseller-token

# Backend Port
PORT=3000
```

**⚠️ Never commit `.env` to Git!**

---

## 🧪 Testing the API

### Using cURL

**Get available products (Reseller):**
```bash
curl -H "Authorization: Bearer secret-reseller-token" \
     http://localhost:3000/api/v1/products
```

**Purchase as Reseller:**
```bash
curl -X POST \
     -H "Authorization: Bearer secret-reseller-token" \
     -H "Content-Type: application/json" \
     -d '{"reseller_price": 120.00}' \
     http://localhost:3000/api/v1/products/{product-id}/purchase
```

---

## 📦 Sample Data

The database includes 5 sample coupons:
- 🍕 Pizza Hut - ₪60
- 💆 Spa Treatment - ₪230
- 🎬 Cinema City - ₪100
- 🍽️ Fine Dining - ₪390
- 💪 Gym Membership - ₪480

---

## 🏗️ Architecture

```
Frontend (React)
    ↓ HTTP
Backend (Express)
    ↓ SQL
MySQL Database
```

**Backend Layers:**
- **Routes** → Define endpoints
- **Controllers** → Handle requests/responses
- **Services** → Business logic
- **Database** → Data persistence

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Change ports in .env
MYSQL_PORT=3308
PORT=3001
```

### Database connection failed
```bash
# Check MySQL is running
docker ps

# Check logs
docker logs coupon-marketplace-db
```

### Frontend can't connect to backend
```bash
# Check backend is running
curl http://localhost:3000/health
```

---

## 📝 License

MIT

---

## 👤 Author

Your Name
