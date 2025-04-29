// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Endpoint untuk mendapatkan data pengguna
router.get('/', userController.getAllUsers);
// Endpoint untuk menghapus pengguna berdasarkan ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
