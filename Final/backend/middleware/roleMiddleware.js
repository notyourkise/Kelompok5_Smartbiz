// backend/middleware/roleMiddleware.js

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    // Assuming user information (including role) is attached to req.user by the authentication middleware
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

module.exports = checkRole;
