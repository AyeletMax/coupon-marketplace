const { getPool } = require('../db');
const bcrypt = require('bcrypt');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error_code: 'UNAUTHORIZED', 
      message: 'Missing or invalid authorization header' 
    });
  }
  
  const token = authHeader.substring(7);
  
  if (token.length < 8) {
    return res.status(401).json({ 
      error_code: 'UNAUTHORIZED', 
      message: 'Invalid token' 
    });
  }

  try {
    const pool = await getPool();
    const tokenPrefix = token.substring(0, 8);
    
    const [rows] = await pool.query(
      'SELECT id, name, token_hash FROM resellers WHERE token_prefix = ?',
      [tokenPrefix]
    );

    let matchedReseller = null;

    for (const row of rows) {
      const match = await bcrypt.compare(token, row.token_hash);
      if (match) {
        matchedReseller = { id: row.id, name: row.name };
        break;
      }
    }

    if (!matchedReseller) {
      return res.status(401).json({ 
        error_code: 'UNAUTHORIZED', 
        message: 'Invalid token' 
      });
    }

    req.reseller = matchedReseller;
    
    next();
  } catch (error) {
    console.error('Reseller auth error:', error);
    return res.status(500).json({
      error_code: 'SERVER_ERROR',
      message: 'Reseller authentication failed',
    });
  }
}

module.exports = authMiddleware;
