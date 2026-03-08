const express = require('express');
const router = express.Router();
const adminCouponController = require('../controllers/adminCouponController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

router.use(adminAuthMiddleware);

router.get('/products', adminCouponController.getAllCoupons);
router.post('/products', adminCouponController.createCoupon);
router.get('/products/:id', adminCouponController.getCouponById);
router.put('/products/:id', adminCouponController.updateCoupon);
router.delete('/products/:id', adminCouponController.deleteCoupon);

module.exports = router;
