const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/list', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM rooms');
    res.json(rows);
  } catch (err) {
    res.status(500).send('Gagal mengambil daftar kamar kos');
  }
});

router.post('/add', async (req, res) => {
  const { roomName } = req.body;
  try {
    await pool.query('INSERT INTO rooms (room_name) VALUES (?)', [roomName]);
    res.send(`Kamar ${roomName} berhasil ditambahkan`);
  } catch (err) {
    res.status(500).send('Gagal menambahkan kamar');
  }
});

module.exports = router;
