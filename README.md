# Coupon Marketplace

A backend system for a digital coupon marketplace supporting direct customer purchases and external reseller integrations via REST API.

## Overview

This application provides:
- **Admin Panel**: Full CRUD operations for coupon management
- **Customer Channel**: Browse and purchase coupons at fixed prices
- **Reseller API**: Authenticated REST API for bulk purchases with flexible pricing

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React (Vite)
- **Database**: MySQL 8.0
- **Deployment**: Docker Compose

## Quick Start

```bash
git clone <repository-url>
cd coupon-marketplace
cp env.example .env
docker compose up -d --build
```

**Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:3000

**Default credentials:**
- Admin password: `admin123`

**Note on Resellers:** No reseller accounts are pre-created. To test reseller functionality, first login as admin, then create a reseller via `POST /api/admin/resellers`. The response will include a unique Bearer token for API authentication.

The database initializes automatically with sample data (5 coupons).

## Architecture

```
React Frontend
    ↓
Express Backend
    ├── Controllers (HTTP handlers)
    ├── Services (Business logic)
    ├── Middleware (Authentication)
    └── Routes (API endpoints)
    ↓
MySQL Database
    ├── products
    ├── coupons
    ├── admins
    └── resellers
```

## Authentication

- **Admin**: Password-based login → Bearer token (24h validity)
- **Reseller**: Bearer token stored in database
- **Customer**: No authentication required

## Core Features

### Pricing Model

Server-side calculation ensures pricing integrity:

```
minimum_sell_price = cost_price × (1 + margin_percentage / 100)
```

**Example**: cost_price = 80, margin = 25% → minimum_sell_price = 100

### Admin Operations

- Create/update/delete coupons
- Set cost price and margin percentage
- Manage reseller accounts
- View all products

### Customer Flow

- Browse available coupons
- Purchase at fixed price (minimum_sell_price)
- Receive coupon code instantly

### Reseller API

- Token-based authentication
- Purchase at flexible prices (≥ minimum_sell_price)
- Atomic transactions with race condition protection
- Error handling: `PRODUCT_NOT_FOUND` (404), `PRODUCT_ALREADY_SOLD` (409), `RESELLER_PRICE_TOO_LOW` (400), `UNAUTHORIZED` (401)

## API Endpoints

### Admin (`/api/admin`)
```
POST   /login              - Authenticate admin
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
```
GET    /products           - List available products
GET    /products/:id       - Get product details
POST   /products/:id/purchase - Purchase product
```

## Example Usage

**Admin Login:**
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
```

**Create Reseller:**
```bash
curl -X POST http://localhost:3000/api/admin/resellers \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Reseller Name"}'
```

**Reseller Purchase:**
```bash
curl -X POST http://localhost:3000/api/v1/products/<product-id>/purchase \
  -H "Authorization: Bearer <reseller-token>" \
  -H "Content-Type: application/json" \
  -d '{"reseller_price": 150}'
```

## Environment Variables

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=coupon_marketplace
MYSQL_USER=app
MYSQL_PASSWORD=apppassword
MYSQL_PORT=3307
PORT=3000
```

**Note**: Admin and reseller credentials are stored in the database with bcrypt hashing.

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


## Author

Ayelet Maximove
