const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/login', (req, res) => {
  const { username } = req.body;
  res.send(`Login berhasil untuk user: ${username}`);
});

router.post('/register', (req, res) => {
  const { username } = req.body;
  res.send(`User ${username} berhasil didaftarkan`);
});

module.exports = router;