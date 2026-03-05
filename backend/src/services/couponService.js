const { getPool } = require('../db');
const { v4: uuidv4 } = require('uuid');

function calculateMinimumSellPrice(costPrice, marginPercentage) {
  return costPrice * (1 + marginPercentage / 100);
}

async function createCoupon(data) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const productId = uuidv4();
    const minimumSellPrice = calculateMinimumSellPrice(data.cost_price, data.margin_percentage);
    
    await connection.query(
      'INSERT INTO products (id, name, description, type, image_url) VALUES (?, ?, ?, ?, ?)',
      [productId, data.name, data.description, 'COUPON', data.image_url]
    );
    
    await connection.query(
      'INSERT INTO coupons (product_id, cost_price, margin_percentage, minimum_sell_price, value_type, value) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, data.cost_price, data.margin_percentage, minimumSellPrice, data.value_type, data.value]
    );
    
    await connection.commit();
    return { id: productId, ...data, minimum_sell_price: minimumSellPrice };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getAllCoupons() {
  const pool = await getPool();
  const [rows] = await pool.query(`
    SELECT p.id, p.name, p.description, p.image_url, p.created_at, p.updated_at,
           c.cost_price, c.margin_percentage, c.minimum_sell_price, c.is_sold, c.value_type, c.value
    FROM products p
    JOIN coupons c ON p.id = c.product_id
  `);
  return rows;
}

async function getCouponById(id) {
  const pool = await getPool();
  const [rows] = await pool.query(`
    SELECT p.id, p.name, p.description, p.image_url, p.created_at, p.updated_at,
           c.cost_price, c.margin_percentage, c.minimum_sell_price, c.is_sold, c.value_type, c.value
    FROM products p
    JOIN coupons c ON p.id = c.product_id
    WHERE p.id = ?
  `, [id]);
  return rows[0] || null;
}

async function updateCoupon(id, data) {
  const pool = await getPool();
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    await connection.query(
      'UPDATE products SET name = ?, description = ?, image_url = ? WHERE id = ?',
      [data.name, data.description, data.image_url, id]
    );
    
    const minimumSellPrice = calculateMinimumSellPrice(data.cost_price, data.margin_percentage);
    
    await connection.query(
      'UPDATE coupons SET cost_price = ?, margin_percentage = ?, minimum_sell_price = ?, value_type = ?, value = ? WHERE product_id = ?',
      [data.cost_price, data.margin_percentage, minimumSellPrice, data.value_type, data.value, id]
    );
    
    await connection.commit();
    return { id, ...data, minimum_sell_price: minimumSellPrice };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteCoupon(id) {
  const pool = await getPool();
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
