const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
    // Contoh query login sederhana
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      res.send(`Login berhasil untuk user: ${username}`);
    } else {
      res.status(401).send('User tidak ditemukan');
    }
  } catch (err) {
    res.status(500).send('Terjadi kesalahan saat login');
  }
});

router.post('/register', async (req, res) => {
  const { username } = req.body;
  try {
    await pool.query('INSERT INTO users (username) VALUES (?)', [username]);
    res.send(`User ${username} berhasil didaftarkan`);
  } catch (err) {
    res.status(500).send('Gagal mendaftarkan user');
  }
});

module.exports = router;
