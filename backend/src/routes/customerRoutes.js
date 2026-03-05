const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Direct customer channel (no Bearer token)
router.get('/coupons', customerController.getAvailableCoupons);
router.post('/coupons/:productId/purchase', customerController.purchaseCoupon);

module.exports = router;

