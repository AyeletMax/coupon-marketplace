const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { getPool } = require('../db');

const activeTokens = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of activeTokens.entries()) {
    if (now > data.expiresAt) {
      activeTokens.delete(token);
    }
  }
}

function isValidToken(token) {
  cleanExpiredTokens();
  return activeTokens.has(token);
}

async function getDefaultAdmin() {
  const pool = await getPool();
  const [rows] = await pool.query(
    'SELECT id, username, password_hash FROM admins ORDER BY id ASC LIMIT 1'
  );
  return rows[0] || null;
}

async function login(password) {
  const admin = await getDefaultAdmin();

  if (!admin || !admin.password_hash) {
    throw new Error('Admin authentication is not properly configured');
  }

  const isValidPassword = await bcrypt.compare(password, admin.password_hash);

  if (!isValidPassword) {
    return null;
  }

  cleanExpiredTokens();
  activeTokens.clear();

  const token = generateToken();
  const now = Date.now();
  const expiresIn = 24 * 60 * 60 * 1000;

  activeTokens.set(token, {
    createdAt: now,
    expiresAt: now + expiresIn
  });

  return { token, expires_in: 86400 };
}

function logout(token) {
  activeTokens.delete(token);
}

module.exports = {
  login,
  logout,
  isValidToken,
};
