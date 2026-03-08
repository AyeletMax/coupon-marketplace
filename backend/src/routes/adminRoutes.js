const express = require('express');
const router = express.Router();
const adminAuthRoutes = require('./adminAuthRoutes');
const adminCouponRoutes = require('./adminCouponRoutes');
const adminResellerRoutes = require('./adminResellerRoutes');

router.use('/', adminAuthRoutes);
router.use('/', adminCouponRoutes);
router.use('/', adminResellerRoutes);

module.exports = router;
