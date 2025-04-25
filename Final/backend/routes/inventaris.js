const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inventory');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Gagal mengambil data inventaris');
  }
});

router.post('/', async (req, res) => {
  const { itemName } = req.body;
  try {
    await pool.query('INSERT INTO inventory (item_name) VALUES (?)', [itemName]);
    res.send(`Item ${itemName} berhasil ditambahkan ke inventaris`);
  } catch (err) {
    res.status(500).send('Gagal menambahkan item ke inventaris');
  }
});

module.exports = router;
