CREATE TABLE products (
    id              CHAR(36) PRIMARY KEY COMMENT 'UUID',
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    type            ENUM('COUPON') NOT NULL DEFAULT 'COUPON' COMMENT 'Product type',
    image_url       VARCHAR(500) NOT NULL COMMENT 'Image URL',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

CREATE TABLE coupons (
    product_id          CHAR(36) PRIMARY KEY,

    cost_price          DECIMAL(10,2) NOT NULL CHECK (cost_price >= 0),
    margin_percentage   DECIMAL(5,2) NOT NULL CHECK (margin_percentage >= 0),
    minimum_sell_price  DECIMAL(10,2)
        GENERATED ALWAYS AS (
            cost_price * (1 + margin_percentage / 100)
        ) STORED,

    is_sold             BOOLEAN NOT NULL DEFAULT FALSE,

    value_type          ENUM('STRING','IMAGE') NOT NULL COMMENT 'Coupon value type',
    value               TEXT NOT NULL COMMENT 'Coupon value – revealed only after purchase',

    CONSTRAINT fk_coupon_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

    INDEX idx_is_sold (is_sold),
    INDEX idx_minimum_sell_price (minimum_sell_price)
);

CREATE TABLE admins (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_admin_username (username)
);

CREATE TABLE resellers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    token_hash      VARCHAR(255) NOT NULL COMMENT 'bcrypt hash of the reseller Bearer token',
    token_prefix    VARCHAR(8) NOT NULL COMMENT 'First 8 chars of token for indexed lookup',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY uq_reseller_name (name),
    INDEX idx_token_prefix (token_prefix)
);