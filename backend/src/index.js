/**
 * Coupon Marketplace - Backend entry point
 * שלב 2c: חיבור ל־MySQL
 */

const path = require('path');
const fs = require('fs');
const envInCwd = path.resolve(process.cwd(), '.env');
const envInParent = path.resolve(process.cwd(), '..', '.env');
const envPath = fs.existsSync(envInCwd) ? envInCwd : envInParent;
require('dotenv').config({ path: envPath });

const express = require('express');
const { checkConnection } = require('./db');
const adminRoutes = require('./routes/adminRoutes');
const resellerRoutes = require('./routes/resellerRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
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
