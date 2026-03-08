const { getPool } = require('../db');

async function purchaseProductInternal(productId, finalPrice, validateMinimumPrice = false) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [rows] = await connection.query(`
      SELECT p.id, c.minimum_sell_price, c.is_sold, c.value_type, c.value
      FROM products p
      JOIN coupons c ON p.id = c.product_id
      WHERE p.id = ?
      FOR UPDATE
    `, [productId]);
    
    if (rows.length === 0) {
      await connection.rollback();
      return { error: 'PRODUCT_NOT_FOUND' };
    }
    
    const product = rows[0];
    
    if (product.is_sold) {
      await connection.rollback();
      return { error: 'PRODUCT_ALREADY_SOLD' };
    }
    
    if (validateMinimumPrice && finalPrice < product.minimum_sell_price) {
      await connection.rollback();
      return { error: 'RESELLER_PRICE_TOO_LOW' };
    }
    
    await connection.query(
      'UPDATE coupons SET is_sold = TRUE WHERE product_id = ?',
      [productId]
    );
    
    await connection.commit();
    
    return {
      product_id: productId,
      final_price: finalPrice,
      value_type: product.value_type,
      value: product.value
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  purchaseProductInternal,
};
