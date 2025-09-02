// backend/routes/coffeeShop.js
const express = require('express');
const router = express.Router();
const coffeeShopController = require('../controllers/coffeeShopController');
const { protect: authenticateToken } = require('../middleware/authMiddleware'); // Changed this line
const checkRole = require('../middleware/roleMiddleware'); // Import role checking middleware

// Middleware to apply authentication to all coffee shop routes
router.use(authenticateToken); // This will now correctly use the 'protect' function

// --- Menu Routes ---
// GET all menus
router.get('/menus', coffeeShopController.getAllMenus);

// GET a single menu by ID
router.get('/menus/:id', coffeeShopController.getMenuById);

// POST (create) a new menu item
router.post('/menus', checkRole('superadmin'), coffeeShopController.createMenu);

// PUT (update) a menu item by ID
router.put('/menus/:id', checkRole('superadmin'), coffeeShopController.updateMenu);

// DELETE a menu item by ID
router.delete('/menus/:id', checkRole('superadmin'), coffeeShopController.deleteMenu);

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
