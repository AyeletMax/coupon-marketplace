const { getPool } = require('../db');
const { purchaseProductInternal } = require('./purchaseService');

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
  return purchaseProductInternal(productId, resellerPrice, true);
}

module.exports = {
  getAvailableProducts,
  getProductById,
  purchaseProduct,
};
