const { getPool } = require('../db');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function createReseller(name) {
  const pool = await getPool();
  
  const [existing] = await pool.query(
    'SELECT id FROM resellers WHERE name = ?',
    [name]
  );
  
  if (existing.length > 0) {
    const error = new Error('Reseller name already exists');
    error.code = 'DUPLICATE_NAME';
    throw error;
  }
  
  const token = generateToken();
  const tokenHash = await bcrypt.hash(token, 12);
  
  const [result] = await pool.query(
    'INSERT INTO resellers (name, token_hash) VALUES (?, ?)',
    [name, tokenHash]
  );
  
  return {
    id: result.insertId,
    name,
    token
  };
}

async function getAllResellers() {
  const pool = await getPool();
  const [rows] = await pool.query(
    'SELECT id, name, created_at, updated_at FROM resellers ORDER BY created_at DESC'
  );
  return rows;
}

module.exports = {
  createReseller,
  getAllResellers,
};
