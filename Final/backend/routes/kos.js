const kosController = require('../controllers/kosController');
const express = require('express');
const router = express.Router();
// const { protect } = require('../middleware/authMiddleware'); // Temporarily commented out

// @route   GET /api/kos
// @desc    Get all kos rooms
// @access  Private (Superadmin)
router.get('/', kosController.getAllKosRooms); // Removed protect

// @route   GET /api/kos/:id
// @desc    Get a single kos room by ID
// @access  Private (Superadmin)
router.get('/:id', kosController.getKosRoomById); // Removed protect

// @route   POST /api/kos
// @desc    Create a new kos room
// @access  Private (Superadmin)
router.post('/', kosController.createKosRoom); // Removed protect

// @route   PUT /api/kos/:id
// @desc    Update a kos room by ID
// @access  Private (Superadmin)
router.put('/:id', kosController.updateKosRoom); // Removed protect

// @route   DELETE /api/kos/:id
// @desc    Delete a kos room by ID
// @access  Private (Superadmin)
router.delete('/:id', kosController.deleteKosRoom); // Removed protect

module.exports = router;
