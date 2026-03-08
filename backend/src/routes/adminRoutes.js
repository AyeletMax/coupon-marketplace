const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

router.post('/login', adminController.adminLogin);
router.use(adminAuthMiddleware);
router.post('/logout', adminController.adminLogout);
router.get('/products', adminController.getAllCoupons);
router.post('/products', adminController.createCoupon);
router.get('/products/:id', adminController.getCouponById);
router.put('/products/:id', adminController.updateCoupon);
router.delete('/products/:id', adminController.deleteCoupon);
router.post('/resellers', adminController.createReseller);
router.get('/resellers', adminController.getAllResellers);

module.exports = router;
