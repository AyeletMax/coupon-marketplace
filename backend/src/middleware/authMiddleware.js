function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error_code: 'UNAUTHORIZED', 
      message: 'Missing or invalid authorization header' 
    });
  }
  
  const token = authHeader.substring(7);
  const validToken = process.env.RESELLER_TOKEN || 'secret-reseller-token';
  
  if (token !== validToken) {
    return res.status(401).json({ 
      error_code: 'UNAUTHORIZED', 
      message: 'Invalid token' 
    });
  }
  
  next();
}

module.exports = authMiddleware;
