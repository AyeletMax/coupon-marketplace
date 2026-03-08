const express = require('express');
const router = express.Router();
const adminResellerController = require('../controllers/adminResellerController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

router.use(adminAuthMiddleware);

router.post('/resellers', adminResellerController.createReseller);
router.get('/resellers', adminResellerController.getAllResellers);

module.exports = router;
