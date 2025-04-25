// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

// Endpoint untuk mendapatkan data pengguna
router.get('/users', userController.getAllUsers);

module.exports = router;
