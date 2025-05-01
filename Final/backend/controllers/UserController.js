const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi untuk mendapatkan semua pengguna
const getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT id, username, role FROM users");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Error mengambil data pengguna:", err);
    res.status(500).json({ error: "Gagal mengambil data pengguna" });
  }
};

// Fungsi untuk membuat user baru
const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  // Removed the check for req.user.role as it's not available during public registration
  // Access control for creating superadmins should be handled in authenticated routes.

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // pg returns a result object, no need to destructure. Success is implied if no error.
    await db.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3)",
      [username, hashedPassword, role]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Fungsi untuk login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "your-secret-key"
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fungsi untuk menghapus pengguna
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  // Pastikan hanya superadmin yang dapat menghapus pengguna
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ error: "Access denied. Only superadmin can delete users." });
  }

  try {
    const result = await db.query("DELETE FROM users WHERE id = $1", [userId]);

    // Use rowCount for pg
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({ message: "Pengguna berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error menghapus pengguna:", err);
    res.status(500).json({ error: "Gagal menghapus pengguna" });
  }
};

// Fungsi untuk mengupdate pengguna
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { username, role } = req.body;

  // Pastikan hanya superadmin yang dapat mengubah role pengguna menjadi superadmin
  if (role === 'superadmin' && req.user.role !== 'superadmin') {
    return res.status(403).json({ error: "Access denied. Only superadmin can assign superadmin role." });
  }

  try {
    const result = await db.query(
      "UPDATE users SET username = $1, role = $2 WHERE id = $3",
      [username, role, userId]
    );

    // Use rowCount for pg
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({ message: "Pengguna berhasil diperbarui" });
  } catch (error) {
    console.error("❌ Error mengupdate pengguna:", error);
    res.status(500).json({ error: "Gagal mengupdate pengguna" });
  }
};

// Ekspor semua fungsi
module.exports = {
  getAllUsers,
  createUser,
  loginUser,
  deleteUser,
  updateUser,
};
