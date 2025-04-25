// src/controllers/userController.js

const db = require('../config/db');

// Ambil semua data pengguna
const getAllUsers = (req, res) => {
  const sql = `SELECT id, username, email FROM users`;  // Sesuaikan query dengan struktur tabel Anda

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error mengambil data pengguna:', err);
      return res.status(500).json({ error: 'Gagal mengambil data pengguna' });
    }
    res.status(200).json(results);
  });
};

module.exports = {
  getAllUsers,
};
