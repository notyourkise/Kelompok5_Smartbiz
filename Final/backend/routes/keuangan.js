const express = require('express');
const router = express.Router();
const keuanganController = require('../controllers/keuanganControllers');
const authenticateToken = require('../middleware/authMiddleware'); // Import middleware untuk otentikasi

// Middleware untuk memastikan hanya superadmin yang bisa mengakses rute tertentu
const authorizeSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: 'Akses ditolak. Hanya superadmin yang bisa mengakses ini.' });
  }
  next();
};

// Endpoint untuk mendapatkan data transaksi berdasarkan kategori (Semua orang yang terautentikasi bisa mengakses ini)
router.get('/detail', authenticateToken, keuanganController.getAllTransactionsDetail);

// Endpoint untuk menambahkan transaksi baru (Hanya untuk Superadmin)
router.post('/detail', authenticateToken, authorizeSuperAdmin, keuanganController.createTransactionDetail);

module.exports = router;
