const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/menu', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menu_items');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Gagal mengambil daftar menu');
  }
});

router.post('/order', async (req, res) => {
  const { itemName } = req.body;
  try {
    await pool.query('INSERT INTO orders (item_name) VALUES (?)', [itemName]);
    res.send(`Pesanan ${itemName} berhasil ditambahkan`);
  } catch (err) {
    res.status(500).send('Gagal menambahkan pesanan');
  }
});

module.exports = router;
