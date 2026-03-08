const adminCouponService = require('../services/adminCouponService');
const validator = require('validator');

function validateAndSanitizeCoupon(body) {
  const { name, description, image_url, cost_price, margin_percentage, value_type, value } = body;

  if (!name || !image_url || cost_price == null || margin_percentage == null || !value_type || !value) {
    return { error: { error_code: 'MISSING_FIELDS', message: 'Missing required fields' } };
  }

  const trimmedImageUrl = image_url.trim();

  if (!validator.isURL(trimmedImageUrl, { protocols: ['http', 'https'] })) {
    return { error: { error_code: 'INVALID_URL', message: 'image_url must be a valid URL' } };
  }

  if (cost_price < 0 || margin_percentage < 0) {
    return { error: { error_code: 'INVALID_PRICING', message: 'cost_price and margin_percentage must be >= 0' } };
  }

  if (!['STRING', 'IMAGE'].includes(value_type)) {
    return { error: { error_code: 'INVALID_VALUE_TYPE', message: 'value_type must be STRING or IMAGE' } };
  }

  return {
    name: validator.escape(name.trim()),
    description: description ? validator.escape(description.trim()) : '',
    image_url: trimmedImageUrl,
    cost_price,
    margin_percentage,
    value_type,
    value: validator.escape(value.trim())
  };
}

async function createCoupon(req, res) {
  try {
    const result = validateAndSanitizeCoupon(req.body);
    if (result.error) {
      return res.status(400).json(result.error);
    }

    const coupon = await adminCouponService.createCoupon(result);
    res.status(201).json(coupon);

  } catch (error) {
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      message: error.message
    });
  }
}

async function updateCoupon(req, res) {
  try {
    const result = validateAndSanitizeCoupon(req.body);
    if (result.error) {
      return res.status(400).json(result.error);
    }

    const existing = await adminCouponService.getCouponById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        error_code: 'PRODUCT_NOT_FOUND',
        message: 'Coupon not found'
      });
    }

    const coupon = await adminCouponService.updateCoupon(
      req.params.id,
      result
    );

    res.json(coupon);

  } catch (error) {
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      message: error.message
    });
  }
}

async function getAllCoupons(req, res) {
  try {
    const coupons = await adminCouponService.getAllCoupons();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      message: error.message
    });
  }
}

async function getCouponById(req, res) {
  try {
    const coupon = await adminCouponService.getCouponById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        error_code: 'PRODUCT_NOT_FOUND',
        message: 'Coupon not found'
      });
    }

    res.json(coupon);

  } catch (error) {
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      message: error.message
    });
  }
}

async function deleteCoupon(req, res) {
  try {
    const deleted = await adminCouponService.deleteCoupon(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error_code: 'PRODUCT_NOT_FOUND',
        message: 'Coupon not found'
      });
    }

    res.status(204).send();

  } catch (error) {
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      message: error.message
    });
  }
}

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};