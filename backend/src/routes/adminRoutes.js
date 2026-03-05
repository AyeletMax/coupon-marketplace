const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/coupons', adminController.createCoupon);
router.get('/coupons', adminController.getAllCoupons);
router.get('/coupons/:id', adminController.getCouponById);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

module.exports = router;
