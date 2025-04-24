const express = require('express');
const router = express.Router();
const keuanganController = require('../controllers/keuanganControllers');

// Endpoint keuangan
router.get('/detail', keuanganController.getAllTransactionsDetail);
router.post('/detail', keuanganController.createTransactionDetail);

module.exports = router;
