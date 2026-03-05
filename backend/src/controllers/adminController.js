const couponService = require('../services/couponService');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Hash של סיסמת המנהל – נטען ממשתנה סביבה לצורך גמישות ואבטחה
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// אחסון טוקנים פעילים (בפרודקשן - השתמש ב-Redis או מסד נתונים)
const activeTokens = new Map(); // Map<token, { createdAt, expiresAt }>

// יצירת טוקן אקראי
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// ניקוי טוקנים שפגו
function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of activeTokens.entries()) {
    if (now > data.expiresAt) {
      activeTokens.delete(token);
    }
  }
}

// בדיקה אם טוקן תקף
function isValidToken(token) {
  cleanExpiredTokens();
  return activeTokens.has(token);
}

// התחברות מנהל
async function adminLogin(req, res) {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ 
        error_code: 'MISSING_PASSWORD', 
        message: 'Password is required' 
      });
    }
    
    if (!ADMIN_PASSWORD_HASH) {
      return res.status(500).json({
        error_code: 'SERVER_ERROR',
        message: 'Admin authentication is not properly configured',
      });
    }
    
    // השוואת הסיסמא עם ה-hash
    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error_code: 'INVALID_CREDENTIALS', 
        message: 'Invalid password' 
      });
    }
    
    // מבטלים טוקנים ישנים – רק סשן אדמין אחד פעיל בכל רגע
    cleanExpiredTokens();
    activeTokens.clear();
    
    // יצירת טוקן חדש
    const token = generateToken();
    const now = Date.now();
    const expiresIn = 24 * 60 * 60 * 1000; // 24 שעות
    
    activeTokens.set(token, {
      createdAt: now,
      expiresAt: now + expiresIn
    });
    
    res.json({ 
      token,
      expires_in: 86400 // 24 שעות בשניות
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      error_code: 'SERVER_ERROR', 
      message: 'Login failed' 
    });
  }
}

// התנתקות מנהל
function adminLogout(req, res) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      activeTokens.delete(token);
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ 
      error_code: 'SERVER_ERROR', 
      message: 'Logout failed' 
    });
  }
}

async function createCoupon(req, res) {
  try {
    const { name, description, image_url, cost_price, margin_percentage, value_type, value } = req.body;
    
    if (!name || !image_url || cost_price == null || margin_percentage == null || !value_type || !value) {
      return res.status(400).json({ error_code: 'MISSING_FIELDS', message: 'Missing required fields' });
    }
    
    const sanitizedName = validator.escape(name.trim());
    const sanitizedDescription = description ? validator.escape(description.trim()) : '';
    const sanitizedImageUrl = image_url.trim();
    const sanitizedValue = validator.escape(value.trim());
    
    if (!validator.isURL(sanitizedImageUrl, { protocols: ['http', 'https'] })) {
      return res.status(400).json({ error_code: 'INVALID_URL', message: 'image_url must be a valid URL' });
    }
    
    if (cost_price < 0 || margin_percentage < 0) {
      return res.status(400).json({ error_code: 'INVALID_PRICING', message: 'cost_price and margin_percentage must be >= 0' });
    }
    
    if (!['STRING', 'IMAGE'].includes(value_type)) {
      return res.status(400).json({ error_code: 'INVALID_VALUE_TYPE', message: 'value_type must be STRING or IMAGE' });
    }
    
    const sanitizedData = {
      name: sanitizedName,
      description: sanitizedDescription,
      image_url: sanitizedImageUrl,
      cost_price,
      margin_percentage,
      value_type,
      value: sanitizedValue
    };
    
    const coupon = await couponService.createCoupon(sanitizedData);
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
    
    const sanitizedName = validator.escape(name.trim());
    const sanitizedDescription = description ? validator.escape(description.trim()) : '';
    const sanitizedImageUrl = image_url.trim();
    const sanitizedValue = validator.escape(value.trim());
    
    if (!validator.isURL(sanitizedImageUrl, { protocols: ['http', 'https'] })) {
      return res.status(400).json({ error_code: 'INVALID_URL', message: 'image_url must be a valid URL' });
    }
    
    if (cost_price < 0 || margin_percentage < 0) {
      return res.status(400).json({ error_code: 'INVALID_PRICING', message: 'cost_price and margin_percentage must be >= 0' });
    }
    
    const existing = await couponService.getCouponById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error_code: 'PRODUCT_NOT_FOUND', message: 'Coupon not found' });
    }
    
    const sanitizedData = {
      name: sanitizedName,
      description: sanitizedDescription,
      image_url: sanitizedImageUrl,
      cost_price,
      margin_percentage,
      value_type,
      value: sanitizedValue
    };
    
    const coupon = await couponService.updateCoupon(req.params.id, sanitizedData);
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
  adminLogin,
  adminLogout,
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  isValidToken,
};
