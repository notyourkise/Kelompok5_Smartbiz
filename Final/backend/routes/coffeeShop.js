const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/menu', (req, res) => {
  res.send('Daftar menu coffee shop berhasil diambil');
});

router.post('/order', (req, res) => {
  const { itemName } = req.body;
  res.send(`Pesanan ${itemName} berhasil ditambahkan`);
});

module.exports = router;