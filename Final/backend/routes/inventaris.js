const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Data inventaris berhasil diambil');
});

router.post('/', (req, res) => {
  const { itemName } = req.body;
  res.send(`Item ${itemName} berhasil ditambahkan ke inventaris`);
});

module.exports = router;