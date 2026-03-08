const customerService = require('../services/customerService');

async function getAvailableCoupons(req, res) {
  try {
    const coupons = await customerService.getAvailableCouponsForCustomer();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ 
      error_code: 'SERVER_ERROR', 
      message: error.message || 'Unknown error'
    });
  }
}

async function purchaseCoupon(req, res) {
  try {
    const productId = req.params.productId;

    const result = await customerService.purchaseCouponAsCustomer(productId);

    if (result.error === 'PRODUCT_NOT_FOUND') {
      return res
        .status(404)
        .json({ error_code: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
    }

    if (result.error === 'PRODUCT_ALREADY_SOLD') {
      return res
        .status(409)
        .json({ error_code: 'PRODUCT_ALREADY_SOLD', message: 'Product already sold' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message || 'Unknown error' });
  }
}

module.exports = {
  getAvailableCoupons,
  purchaseCoupon,
};

