const resellerService = require('../services/resellerService');

async function getAvailableProducts(req, res) {
  try {
    const products = await resellerService.getAvailableProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const product = await resellerService.getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({ error_code: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message });
  }
}

async function purchaseProduct(req, res) {
  try {
    const { reseller_price } = req.body;
    
    if (reseller_price == null) {
      return res.status(400).json({ error_code: 'MISSING_FIELDS', message: 'reseller_price is required' });
    }
    
    const result = await resellerService.purchaseProduct(req.params.productId, reseller_price);
    
    if (result.error === 'PRODUCT_NOT_FOUND') {
      return res.status(404).json({ error_code: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
    }
    
    if (result.error === 'PRODUCT_ALREADY_SOLD') {
      return res.status(409).json({ error_code: 'PRODUCT_ALREADY_SOLD', message: 'Product already sold' });
    }
    
    if (result.error === 'RESELLER_PRICE_TOO_LOW') {
      return res.status(400).json({ error_code: 'RESELLER_PRICE_TOO_LOW', message: 'Reseller price is below minimum sell price' });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error_code: 'SERVER_ERROR', message: error.message });
  }
}

module.exports = {
  getAvailableProducts,
  getProductById,
  purchaseProduct,
};
