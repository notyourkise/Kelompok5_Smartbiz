const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (token == null) {
    // No token provided
    return res.sendStatus(401); // Unauthorized
  }

  // Verify the token
  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      // Token is invalid or expired
      console.error('JWT Verification Error:', err.message);
      return res.sendStatus(403); // Forbidden
    }

    // Token is valid, attach payload to request object (optional but good practice)
    req.user = user; 
    
    // Proceed to the next middleware or route handler
    next(); 
  });
};

module.exports = authenticateToken;
