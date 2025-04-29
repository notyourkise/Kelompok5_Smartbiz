const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const pool = require('./config/db');

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const keuanganRoutes = require('./routes/keuangan');
const kosRoutes = require('./routes/kos');
const coffeeShopRoutes = require('./routes/coffeeShop');
const inventarisRoutes = require('./routes/inventaris');
const UserRoutes = require('./routes/UserRoutes');
const authenticateToken = require('./middleware/authMiddleware'); // Import the authentication middleware

// Use routes
app.use('/auth', authRoutes);
app.use('/keuangan', keuanganRoutes);
app.use('/kos', kosRoutes);
app.use('/coffee', coffeeShopRoutes);
app.use('/inventaris', inventarisRoutes);
// Apply authentication middleware to the user routes
app.use('/api/users', authenticateToken, UserRoutes); 

app.get('/', (req, res) => {
  res.send('Smartbiz Admin API is running 🚀');
});

// Uji koneksi database menggunakan async/await
async function testDatabaseConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW()');
    console.log('✅ Koneksi ke database berhasil:', rows[0]);
  } catch (err) {
    console.error('❌ Koneksi ke database gagal:', err);
  }
}

testDatabaseConnection(); // Panggil fungsi uji koneksi

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
