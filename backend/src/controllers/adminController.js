const couponService = require('../services/couponService');

async function createCoupon(req, res) {
  try {
    const { name, description, image_url, cost_price, margin_percentage, value_type, value } = req.body;
    
    if (!name || !image_url || cost_price == null || margin_percentage == null || !value_type || !value) {
      return res.status(400).json({ error_code: 'MISSING_FIELDS', message: 'Missing required fields' });
    }
    
    if (cost_price < 0 || margin_percentage < 0) {
      return res.status(400).json({ error_code: 'INVALID_PRICING', message: 'cost_price and margin_percentage must be >= 0' });
    }
    
    if (!['STRING', 'IMAGE'].includes(value_type)) {
      return res.status(400).json({ error_code: 'INVALID_VALUE_TYPE', message: 'value_type must be STRING or IMAGE' });
    }
    
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message });
  }
}

async function getAllCoupons(req, res) {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message });
  }
}

async function getCouponById(req, res) {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error_code: 'PRODUCT_NOT_FOUND', message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message });
  }
}

async function updateCoupon(req, res) {
  try {
    const { name, description, image_url, cost_price, margin_percentage, value_type, value } = req.body;
    
    if (!name || !image_url || cost_price == null || margin_percentage == null || !value_type || !value) {
      return res.status(400).json({ error_code: 'MISSING_FIELDS', message: 'Missing required fields' });
    }
    
    if (cost_price < 0 || margin_percentage < 0) {
      return res.status(400).json({ error_code: 'INVALID_PRICING', message: 'cost_price and margin_percentage must be >= 0' });
    }
    
    const existing = await couponService.getCouponById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error_code: 'PRODUCT_NOT_FOUND', message: 'Coupon not found' });
    }
    
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message });
  }
}

async function deleteCoupon(req, res) {
  try {
    const deleted = await couponService.deleteCoupon(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error_code: 'PRODUCT_NOT_FOUND', message: 'Coupon not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message });
  }
}

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
