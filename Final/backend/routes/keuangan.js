const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Data keuangan berhasil diambil');
});

router.post('/', (req, res) => {
  const { type, amount } = req.body;
  res.send(`Data keuangan (${type}, ${amount}) berhasil ditambahkan`);
});

module.exports = router;