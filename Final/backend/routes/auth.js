const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken'); // Import JWT untuk menghasilkan token

// Endpoint untuk registrasi
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Validasi input
  if (!username || !password || !role) {
    return res.status(400).send('Username, password, dan role harus diisi');
  }

  // Pastikan role hanya 'admin' atau 'superadmin'
  if (role !== 'admin' && role !== 'superadmin') {
    return res.status(400).send('Role tidak valid. Hanya admin atau superadmin yang diperbolehkan.');
  }

  try {
    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan username, hashed password, dan role ke database using PostgreSQL syntax
    await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username, hashedPassword, role]);

    res.status(201).send(`User ${username} berhasil didaftarkan`); // Use 201 Created status
  } catch (err) {
    console.error('Error saat registrasi:', err); // Log the actual error to the console

    // Check for specific PostgreSQL duplicate entry error code
    if (err.code === '23505') { // PostgreSQL unique_violation code
      res.status(409).send('Username sudah digunakan'); // 409 Conflict for duplicate
    } else {
      // Send a generic server error for other issues
      res.status(500).send('Terjadi kesalahan pada server saat mendaftarkan user');
    }
  }
});

// Endpoint untuk login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username dan password harus diisi');
  }

  try {
    // Cari user berdasarkan username using PostgreSQL syntax
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) { // Use result.rows
      const user = result.rows[0]; // Use result.rows

      // Verifikasi password dengan bcrypt
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Jika password cocok, kirimkan token
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role }, // Menyertakan role dalam payload
          'your-secret-key', 
          { expiresIn: '1h' } // Token berlaku selama 1 jam
        );
        res.json({ message: 'Login berhasil', token, role: user.role });
      } else {
        res.status(401).send('Password salah');
      }
    } else {
      res.status(401).send('Username atau password salah'); // More generic message for security
    }
  } catch (err) {
    console.error('Error saat login:', err); // Log the actual error
    res.status(500).send('Terjadi kesalahan pada server saat login');
  }
});

module.exports = router;
