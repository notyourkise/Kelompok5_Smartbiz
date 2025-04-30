const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const pool = require('./config/db');

// Konfigurasi CORS untuk membatasi akses hanya untuk frontend
const corsOptions = {
  origin: 'http://localhost:5173',  // Ganti dengan URL frontend kamu
  methods: 'GET,POST,PUT,DELETE',  // Tentukan metode HTTP yang diizinkan
  allowedHeaders: 'Content-Type,Authorization', // Tentukan header yang diizinkan
};

// Menggunakan CORS
app.use(cors(corsOptions));  
app.use(express.json());  // Mengizinkan request dengan format JSON

// Import routes
const authRoutes = require('./routes/auth');
const keuanganRoutes = require('./routes/keuangan');
const kosRoutes = require('./routes/kos');
const coffeeShopRoutes = require('./routes/coffeeShop');
const inventarisRoutes = require('./routes/inventaris');
const UserRoutes = require('./routes/UserRoutes');
const authenticateToken = require('./middleware/authMiddleware'); // Import authentication middleware

// Gunakan routes
app.use('/auth', authRoutes);  // Rute untuk login dan registrasi
app.use('/keuangan', keuanganRoutes);  // Rute untuk manajemen keuangan
app.use('/kos', kosRoutes);  // Rute untuk manajemen kos
app.use('/coffee', coffeeShopRoutes);  // Rute untuk manajemen coffee shop
app.use('/inventaris', inventarisRoutes);  // Rute untuk inventaris
// Gunakan middleware otentikasi untuk rute pengguna
app.use('/api/users', authenticateToken, UserRoutes);  // Rute untuk mengelola pengguna

// Endpoint utama
app.get('/', (req, res) => {
  res.send('Smartbiz Admin API is running 🚀');
});

// Uji koneksi ke database menggunakan async/await
const testDatabaseConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT NOW()');
    console.log('✅ Koneksi ke database berhasil:', rows[0]);
  } catch (err) {
    console.error('❌ Koneksi ke database gagal:', err);
  }
};

// Uji koneksi database saat server dijalankan
testDatabaseConnection(); 

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
