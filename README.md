# Coupon Marketplace

A backend system for a digital coupon marketplace supporting direct customer purchases and external reseller integrations via REST API.

## Overview

- **Admin Panel**: Full CRUD operations for coupon management
- **Customer Channel**: Browse and purchase coupons at fixed prices
- **Reseller API**: Authenticated REST API for bulk purchases with flexible pricing

## Tech Stack

Node.js + Express | React (Vite) | MySQL 8.0 | Docker Compose

## Quick Start

```bash
git clone https://github.com/ayelet-maximove/coupon-marketplace
cd coupon-marketplace
cp env.example .env
docker compose up -d --build
```

**Access:** http://localhost

**Default Admin Password:** `admin123`

The database auto-initializes with 5 sample coupons and an admin account.

**Note:** No reseller accounts are pre-created. Login as admin and create one via `POST /api/admin/resellers` to receive a Bearer token.

## Architecture

```
React Frontend (Port 80)
    ↓
Express Backend (Port 3000)
    ├── Controllers
    ├── Services
    ├── Middleware
    └── Routes
    ↓
MySQL Database (Port 3307)
```

## Authentication

- **Admin**: Password login → Bearer token (24h validity)
- **Reseller**: Bearer token (permanent, stored in DB)
- **Customer**: No authentication required

## Pricing Model

```
minimum_sell_price = cost_price × (1 + margin_percentage / 100)
```

**Example:** cost_price = 80, margin = 25% → minimum_sell_price = 100

**Rules:**
- Customers pay exactly `minimum_sell_price`
- Resellers must pay ≥ `minimum_sell_price`
- Server-side calculation only

## API Endpoints

### Admin (`/api/admin`)
```
POST   /login              - Admin authentication
GET    /products           - List all coupons
POST   /products           - Create coupon
PUT    /products/:id       - Update coupon
DELETE /products/:id       - Delete coupon
POST   /resellers          - Create reseller
GET    /resellers          - List resellers
```

### Customer (`/api/customer`)
```
GET    /coupons            - List available coupons
POST   /coupons/:id/purchase - Purchase coupon
```

### Reseller (`/api/v1`)
**Requires:** `Authorization: Bearer <token>`
```
GET    /products           - List available products
GET    /products/:id       - Get product details
POST   /products/:id/purchase - Purchase product
```

## Example Usage

**1. Admin Login:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
```

**2. Create Reseller:**
```bash
curl -X POST http://localhost:3000/api/admin/resellers \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "My Reseller"}'
```
Response includes unique Bearer token.

**3. Reseller Purchase:**
```bash
curl -X POST http://localhost:3000/api/v1/products/<product-id>/purchase \
  -H "Authorization: Bearer <reseller-token>" \
  -H "Content-Type: application/json" \
  -d '{"reseller_price": 150}'
```

**4. Customer Purchase:**
```bash
curl -X POST http://localhost:3000/api/customer/coupons/<product-id>/purchase
```

## Key Features

**Admin:**
- Create/update/delete coupons with cost price and margin
- Manage reseller accounts
- Rate limiting on login (10 attempts/15 min)

**Customer:**
- Browse available coupons
- Purchase at fixed price
- Instant coupon code delivery

**Reseller:**
- Token-based authentication
- Flexible pricing (≥ minimum)
- Atomic transactions with race condition protection
- Error codes: `401 UNAUTHORIZED`, `404 PRODUCT_NOT_FOUND`, `409 PRODUCT_ALREADY_SOLD`, `400 RESELLER_PRICE_TOO_LOW`

## Database Schema

**products:** id (UUID), name, description, type, image_url, timestamps  
**coupons:** product_id (FK), cost_price, margin_percentage, minimum_sell_price (generated), is_sold, value_type, value  
**admins:** id, username, password_hash (bcrypt), timestamps  
**resellers:** id, name, token_hash (bcrypt), token_prefix, timestamps

## Environment Variables

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=coupon_marketplace
MYSQL_USER=app
MYSQL_PASSWORD=apppassword
MYSQL_PORT=3307
PORT=3000
```

**Security:** Admin and reseller credentials stored in database with bcrypt hashing, not in environment variables.

## Project Structure

```
coupon-marketplace/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── db.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── sample-data.sql
│   └── Dockerfile
├── frontend/
│   ├── src/
│   └── Dockerfile
└── docker-compose.yml
```

## Troubleshooting

**Port in use:** Change `PORT` in `.env`  
**Database error:** `docker logs coupon-marketplace-db`  
**Clean restart:** `docker compose down -v && docker compose up -d --build`

## Author

Ayelet Maximove
