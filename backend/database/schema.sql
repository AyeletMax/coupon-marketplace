-- ============================================================
-- Coupon Marketplace - Database Schema (Step 2a)
-- ============================================================
-- זה הקובץ שיוצר את הטבלאות במסד הנתונים.
-- מריצים אותו פעם אחת אחרי ש־MySQL עולה (בשלב 2b).
-- ============================================================

-- טבלה ראשית: כל מוצר במערכת (בעתיד נוסיף סוגים כמו COUPON, BOOK...)
CREATE TABLE products (
    id              CHAR(36) PRIMARY KEY COMMENT 'UUID',
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    type            ENUM('COUPON') NOT NULL DEFAULT 'COUPON' COMMENT 'סוג המוצר – כרגע רק קופון',
    image_url       VARCHAR(500) NOT NULL COMMENT 'כתובת לתמונה',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- טבלה שמרחיבה מוצר מסוג קופון (רק שורה אחת לכל product שסוגו COUPON)
-- cost_price, margin_percentage – רק אדמין קובע. minimum_sell_price מחושב בשרת.
CREATE TABLE coupons (
    product_id          CHAR(36) PRIMARY KEY,
    cost_price          DECIMAL(10, 2) NOT NULL CHECK (cost_price >= 0),
    margin_percentage   DECIMAL(5, 2) NOT NULL CHECK (margin_percentage >= 0),
    minimum_sell_price  DECIMAL(10, 2) NOT NULL COMMENT 'מחושב: cost_price * (1 + margin/100)',
    is_sold             BOOLEAN NOT NULL DEFAULT FALSE,
    value_type          ENUM('STRING', 'IMAGE') NOT NULL COMMENT 'סוג הערך (טקסט או תמונה)',
    value               TEXT NOT NULL COMMENT 'הערך עצמו – barcode/QR/URL – נחשף רק אחרי רכישה',

    CONSTRAINT fk_coupon_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- סיכום:
-- products  = מוצר כללי (id, name, description, type, image_url, תאריכים)
-- coupons   = פרטי קופון (מחיר, מרווח, נמכר?, ערך) – מקושר ל־products דרך product_id
-- ============================================================
