// backend/routes/coffeeShop.js
const express = require('express');
const router = express.Router();
const coffeeShopController = require('../controllers/coffeeShopController');
const authenticateToken = require('../middleware/authMiddleware');
// const checkRole = require('../middleware/roleMiddleware'); // Placeholder for role checking middleware

// Middleware to apply authentication to all coffee shop routes
router.use(authenticateToken);

// Middleware for role checking (Admin and Superadmin) - Placeholder
const checkAdminOrSuperAdmin = (req, res, next) => {
    // In a real implementation, you'd check req.user.role
    // For now, we'll just proceed. Replace with actual role check later.
    // if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    //     return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    // }
    console.log('Role check bypassed for now. User:', req.user); // Log user info if available
    next();
};

// Apply role check middleware to all subsequent routes in this file
router.use(checkAdminOrSuperAdmin);

// --- Menu Routes ---
// GET all menus
router.get('/menus', coffeeShopController.getAllMenus);

// GET a single menu by ID
router.get('/menus/:id', coffeeShopController.getMenuById);

// POST (create) a new menu item
router.post('/menus', coffeeShopController.createMenu);

// PUT (update) a menu item by ID
router.put('/menus/:id', coffeeShopController.updateMenu);

// DELETE a menu item by ID
router.delete('/menus/:id', coffeeShopController.deleteMenu);

// --- Order Routes ---
// POST (create) a new order
router.post('/orders', coffeeShopController.createOrder);

// GET a specific order by ID
router.get('/orders/:id', coffeeShopController.getOrderById);

// GET all orders (optional history)
router.get('/orders', coffeeShopController.getAllOrders);

// --- Receipt Route ---
// GET endpoint to generate/fetch receipt data for an order
// Might be combined with getOrderById depending on implementation
router.get('/orders/:id/receipt', coffeeShopController.printReceipt);


module.exports = router;
