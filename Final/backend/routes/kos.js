const express = require('express');
const router = express.Router();

router.get('/list', (req, res) => {
  res.send('Daftar kamar kos berhasil diambil');
});

router.post('/add', (req, res) => {
  const { roomName } = req.body;
  res.send(`Kamar ${roomName} berhasil ditambahkan`);
});

module.exports = router;