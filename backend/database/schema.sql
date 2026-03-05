-- ============================================================
-- Coupon Marketplace - Database Schema
-- ============================================================

CREATE TABLE products (
    id              CHAR(36) PRIMARY KEY COMMENT 'UUID',
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    type            ENUM('COUPON') NOT NULL DEFAULT 'COUPON' COMMENT 'סוג המוצר',
    image_url       VARCHAR(500) NOT NULL COMMENT 'כתובת לתמונה',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

CREATE TABLE coupons (
    product_id          CHAR(36) PRIMARY KEY,
    cost_price          DECIMAL(10, 2) NOT NULL CHECK (cost_price >= 0),
    margin_percentage   DECIMAL(5, 2) NOT NULL CHECK (margin_percentage >= 0),
    minimum_sell_price  DECIMAL(10, 2) NOT NULL COMMENT 'מחושב: cost_price * (1 + margin/100)',
    is_sold             BOOLEAN NOT NULL DEFAULT FALSE,
    value_type          ENUM('STRING', 'IMAGE') NOT NULL COMMENT 'סוג הערך',
    value               TEXT NOT NULL COMMENT 'הערך עצמו – נחשף רק אחרי רכישה',

    CONSTRAINT fk_coupon_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    INDEX idx_is_sold (is_sold),
    INDEX idx_minimum_sell_price (minimum_sell_price)
);

-- ============================================================
-- סיכום:
-- products  = מוצר כללי (id, name, description, type, image_url, תאריכים)
-- coupons   = פרטי קופון (מחיר, מרווח, נמכר?, ערך) – מקושר ל־products דרך product_id
-- ============================================================
