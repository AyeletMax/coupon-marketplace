const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// Public login endpoint (no auth required)
router.post('/login', adminController.adminLogin);

// Protected admin endpoints
router.use(adminAuthMiddleware);

router.post('/logout', adminController.adminLogout);
router.post('/coupons', adminController.createCoupon);
router.get('/coupons', adminController.getAllCoupons);
router.get('/coupons/:id', adminController.getCouponById);
router.put('/coupons/:id', adminController.updateCoupon);
router.delete('/coupons/:id', adminController.deleteCoupon);

module.exports = router;
