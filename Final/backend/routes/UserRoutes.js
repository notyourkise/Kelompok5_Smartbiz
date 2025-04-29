// src/routes/UserRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Endpoint untuk mendapatkan data pengguna
router.get('/', userController.getAllUsers);

// Endpoint untuk menghapus pengguna berdasarkan ID
router.delete('/:id', userController.deleteUser);

// Endpoint untuk membuat pengguna baru
router.post('/', userController.createUser);  // Pastikan endpoint createUser ada di sini

router.put('/:id', userController.updateUser);  // Rute untuk edit pengguna

// Endpoint untuk membuat pengguna baru
router.post('/register', userController.createUser);

// Endpoint untuk login
router.post('/login', userController.loginUser);

module.exports = router;
