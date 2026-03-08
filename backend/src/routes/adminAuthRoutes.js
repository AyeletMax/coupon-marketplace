const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

router.post('/login', adminAuthController.adminLogin);
router.post('/logout', adminAuthMiddleware, adminAuthController.adminLogout);

module.exports = router;
