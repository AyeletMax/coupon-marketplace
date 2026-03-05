const { getPool } = require('../db');

async function getAvailableProducts() {
  const pool = await getPool();
  const [rows] = await pool.query(`
    SELECT p.id, p.name, p.description, p.image_url, c.minimum_sell_price as price
    FROM products p
    JOIN coupons c ON p.id = c.product_id
    WHERE c.is_sold = FALSE
  `);
  return rows;
}

async function getProductById(id) {
  const pool = await getPool();
  const [rows] = await pool.query(`
    SELECT p.id, p.name, p.description, p.image_url, c.minimum_sell_price as price
    FROM products p
    JOIN coupons c ON p.id = c.product_id
    WHERE p.id = ? AND c.is_sold = FALSE
  `, [id]);
  return rows[0] || null;
}

async function purchaseProduct(productId, resellerPrice) {
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
    
    if (resellerPrice < product.minimum_sell_price) {
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
      final_price: resellerPrice,
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
  getAvailableProducts,
  getProductById,
  purchaseProduct,
};
