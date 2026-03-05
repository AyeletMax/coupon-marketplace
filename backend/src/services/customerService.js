/**
 * Customer service – direct coupon purchases by end-customers (not resellers).
 * The customer always pays minimum_sell_price, never sends a custom price.
 */

const { getPool } = require('../db');

/**
 * Returns all coupons that are not sold yet,
 * with price = minimum_sell_price (for frontend display).
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
 * Direct coupon purchase by customer:
 * - Validates that product exists and is not sold
 * - Uses price = minimum_sell_price (not provided by the customer)
 * - Marks coupon as sold
 * - Returns the value (coupon code)
 * All inside a transaction to avoid race conditions.
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

