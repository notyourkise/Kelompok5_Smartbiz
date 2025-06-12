const express = require('express');
const router = express.Router();
const keuanganController = require('../controllers/keuanganControllers');
// Impor 'protect' dan 'authorize' dari authMiddleware menggunakan destructuring
const { protect, authorize } = require('../middleware/authMiddleware');

// Endpoint untuk mendapatkan data transaksi berdasarkan kategori (Semua orang yang terautentikasi bisa mengakses ini)
// Gunakan 'protect' sebagai middleware otentikasi
router.get('/detail', protect, keuanganController.getAllTransactionsDetail);

// Endpoint untuk menambahkan transaksi baru (Hanya untuk Superadmin)
// Gunakan 'protect' untuk otentikasi dan 'authorize' untuk otorisasi peran
router.post('/detail', protect, authorize(['superadmin', 'admin']), keuanganController.createTransactionDetail);

// Endpoint untuk mengupdate transaksi (Hanya untuk Superadmin)
router.put('/detail/:id', protect, authorize(['superadmin']), keuanganController.updateTransactionDetail);

// Endpoint untuk menghapus transaksi (Hanya untuk Superadmin)
router.delete('/detail/:id', protect, authorize(['superadmin']), keuanganController.deleteTransactionDetail);

module.exports = router;
