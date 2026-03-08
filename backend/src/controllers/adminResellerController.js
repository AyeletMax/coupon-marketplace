const adminResellerService = require('../services/adminResellerService');
const validator = require('validator');

function handleServerError(res, error, message) {
  console.error(message, error);

  return res.status(500).json({
    error_code: 'SERVER_ERROR',
    message
  });
}

async function createReseller(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        error_code: 'MISSING_NAME',
        message: 'Reseller name is required'
      });
    }

    const sanitizedName = validator.escape(name.trim());
    const reseller = await adminResellerService.createReseller(sanitizedName);

    res.status(201).json(reseller);

  } catch (error) {
    if (error.code === 'DUPLICATE_NAME') {
      return res.status(409).json({
        error_code: 'DUPLICATE_NAME',
        message: 'Reseller name already exists'
      });
    }

    return handleServerError(res, error, 'Failed to create reseller');
  }
}

async function getAllResellers(req, res) {
  try {
    const resellers = await adminResellerService.getAllResellers();
    res.json(resellers);

  } catch (error) {
    return handleServerError(res, error, 'Failed to retrieve resellers');
  }
}

module.exports = {
  createReseller,
  getAllResellers,
};