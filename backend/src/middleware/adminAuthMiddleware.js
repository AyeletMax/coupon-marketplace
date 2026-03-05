const { isValidToken } = require('../controllers/adminController');

function adminAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error_code: 'UNAUTHORIZED', 
      message: 'Missing or invalid authorization header' 
    });
  }
  
  const token = authHeader.substring(7);
  
  if (!isValidToken(token)) {
    return res.status(401).json({ 
      error_code: 'UNAUTHORIZED', 
      message: 'Invalid or expired token' 
    });
  }
  
  next();
}

module.exports = adminAuthMiddleware;
