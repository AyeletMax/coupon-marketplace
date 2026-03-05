const express = require('express');
const router = express.Router();
const resellerController = require('../controllers/resellerController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/products', resellerController.getAvailableProducts);
router.get('/products/:productId', resellerController.getProductById);
router.post('/products/:productId/purchase', resellerController.purchaseProduct);

module.exports = router;
