/**
 * Coupon Marketplace - Backend entry point
 * Step 1: Express server placeholder (routes/DB in later steps)
 */

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Coupon Marketplace API' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
