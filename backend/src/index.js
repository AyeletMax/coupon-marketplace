/**
 * Coupon Marketplace - Backend entry point
 */

const path = require('path');
const fs = require('fs');
const envInCwd = path.resolve(process.cwd(), '.env');
const envInParent = path.resolve(process.cwd(), '..', '.env');
const envPath = fs.existsSync(envInCwd) ? envInCwd : envInParent;
require('dotenv').config({ path: envPath });

// Environment validation
const requiredEnvVars = [
  'MYSQL_HOST',
  'MYSQL_DATABASE',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'RESELLER_TOKEN',
  'ADMIN_PASSWORD_HASH',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file.');
  process.exit(1);
}

console.log('✅ Environment variables validated');

const express = require('express');
const rateLimit = require('express-rate-limit');
const { checkConnection } = require('./db');
const adminRoutes = require('./routes/adminRoutes');
const resellerRoutes = require('./routes/resellerRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Global rate limiting (all routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error_code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for admin login to mitigate brute-force
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error_code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many admin login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());

// Apply stricter limiter only on the admin login endpoint
app.use('/api/admin/login', adminLoginLimiter);

app.use('/api/admin', adminRoutes);
app.use('/api/v1', resellerRoutes);
app.use('/api/customer', customerRoutes);

app.get('/health', async (req, res) => {
  try {
    const dbOk = await checkConnection();
    res.json({
      status: 'ok',
      message: 'Coupon Marketplace API',
      database: dbOk ? 'connected' : 'error',
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      message: 'Coupon Marketplace API',
      database: 'disconnected',
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
