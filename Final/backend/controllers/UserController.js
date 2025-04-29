// src/controllers/UserController.js

const db = require('../config/db');

// Ambil semua data pengguna
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT id, username, role FROM users`);
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Error mengambil data pengguna:', err);
    res.status(500).json({ error: 'Gagal mengambil data pengguna' });
  }
};

// Hapus pengguna berdasarkan ID
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    res.status(200).json({ message: 'Pengguna berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error menghapus pengguna:', err);
    res.status(500).json({ error: 'Gagal menghapus pengguna' });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
};
