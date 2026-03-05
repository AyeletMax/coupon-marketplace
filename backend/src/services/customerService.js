/**
 * Customer service – קנייה ישירה של קופונים ע\"י לקוח (לא ריסיילר).
 * המחיר ללקוח תמיד minimum_sell_price, בלי reseller_price מהלקוח.
 */

const { getPool } = require('../db');

/**
 * מחזיר את כל הקופונים שעדיין לא נמכרו ללקוח,
 * עם price = minimum_sell_price (להצגה ב-frontend).
 */
async function getAvailableCouponsForCustomer() {
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT p.id,
            p.name,
            p.description,
            p.image_url,
            c.minimum_sell_price AS price
     FROM products p
     JOIN coupons c ON p.id = c.product_id
     WHERE c.is_sold = FALSE`
  );
  return rows;
}

/**
 * רכישה ישירה של קופון ע\"י לקוח:
 * - בודק שהמוצר קיים ולא נמכר
 * - גובה מחיר = minimum_sell_price (לא מהלקוח)
 * - מסמן כנמכר
 * - מחזיר את value (קוד הקופון)
 * הכל בטרנזקציה כדי למנוע מירוץ.
 */
async function purchaseCouponAsCustomer(productId) {
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT p.id,
              c.minimum_sell_price,
              c.is_sold,
              c.value_type,
              c.value
       FROM products p
       JOIN coupons c ON p.id = c.product_id
       WHERE p.id = ?
       FOR UPDATE`,
      [productId]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return { error: 'PRODUCT_NOT_FOUND' };
    }

    const product = rows[0];

    if (product.is_sold) {
      await connection.rollback();
      return { error: 'PRODUCT_ALREADY_SOLD' };
    }

    const finalPrice = product.minimum_sell_price;

    await connection.query(
      'UPDATE coupons SET is_sold = TRUE WHERE product_id = ?',
      [productId]
    );

    await connection.commit();

    return {
      product_id: productId,
      final_price: finalPrice,
      value_type: product.value_type,
      value: product.value,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  getAvailableCouponsForCustomer,
  purchaseCouponAsCustomer,
};

