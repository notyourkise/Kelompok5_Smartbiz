const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;
const pool = require('./db');

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const keuanganRoutes = require('./routes/keuangan');
const kosRoutes = require('./routes/kos');
const coffeeShopRoutes = require('./routes/coffeeShop');
const inventarisRoutes = require('./routes/inventaris');

// Use routes
app.use('/auth', authRoutes);
app.use('/keuangan', keuanganRoutes);
app.use('/kos', kosRoutes);
app.use('/coffee', coffeeShopRoutes);
app.use('/inventaris', inventarisRoutes);

app.get('/', (req, res) => {
  res.send('Smartbiz Admin API is running 🚀');
});

// Uji koneksi database
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Koneksi ke database gagal ❌', err);
    } else {
      console.log('Koneksi ke database berhasil ✅', res.rows[0]);
    }
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
