const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan. Akses ditolak." });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      console.error('JWT Verification Error:', err.message);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token telah kedaluwarsa. Silakan login kembali.' });
      }

      return res.status(403).json({ error: "Token tidak valid atau kadaluarsa." });
    }

    // Token valid, user akan berisi payload { id, username, role }
    req.user = user;

    next(); // Lanjut ke route controller
  });
};

module.exports = authenticateToken;
