const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const authenticateToken = require('../middleware/authMiddleware'); // Import middleware untuk otentikasi

// Middleware untuk memastikan hanya superadmin yang bisa mengakses rute tertentu
const authorizeSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Akses ditolak. Hanya superadmin yang bisa mengakses ini.' });
  }
  next();
};

// Endpoint untuk mendapatkan data pengguna
router.get('/', authenticateToken, userController.getAllUsers); // Semua pengguna bisa melihat data pengguna setelah login

// Endpoint untuk menghapus pengguna berdasarkan ID (Hanya untuk Superadmin)
router.delete('/:id', authenticateToken, authorizeSuperAdmin, userController.deleteUser);

// Endpoint untuk membuat pengguna baru (Hanya untuk Superadmin)
router.post('/', authenticateToken, authorizeSuperAdmin, userController.createUser);

// Endpoint untuk mengupdate pengguna (Hanya untuk Superadmin)
router.put('/:id', authenticateToken, authorizeSuperAdmin, userController.updateUser);

// Endpoint untuk membuat pengguna baru (Registrasi) - Semua orang bisa registrasi
router.post('/register', userController.createUser);

// Endpoint untuk login - Semua orang bisa login
router.post('/login', userController.loginUser);

module.exports = router;
