const adminAuthService = require('../services/adminAuthService');

async function adminLogin(req, res) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error_code: 'MISSING_PASSWORD',
        message: 'Password is required'
      });
    }

    const result = await adminAuthService.login(password);

    if (!result) {
      return res.status(401).json({
        error_code: 'INVALID_CREDENTIALS',
        message: 'Invalid password'
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      message: 'Login failed'
    });
  }
}

function adminLogout(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      adminAuthService.logout(token);
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

module.exports = {
  adminLogin,
  adminLogout,
};
