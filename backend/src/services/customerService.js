const { getPool } = require('../db');


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

