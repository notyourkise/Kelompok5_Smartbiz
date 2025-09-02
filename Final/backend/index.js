const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const pool = require("./config/db");
const path = require("path"); // Impor modul path

// Konfigurasi CORS untuk dev & prod
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(express.json()); // Mengizinkan request dengan format JSON

// Middleware untuk menyajikan file statis dari folder 'uploads'
// Ini akan membuat file di dalam folder 'uploads' dapat diakses melalui URL
// Contoh: http://localhost:3001/uploads/bukti_pembayaran_kos/namafile.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const authRoutes = require("./routes/auth");
const keuanganRoutes = require("./routes/keuangan");
const kosRoutes = require("./routes/kos");
// const coffeeShopRoutes = require('./routes/coffeeShop'); // Keep the old one commented or remove if sure
const newCoffeeShopRoutes = require("./routes/coffeeShop"); // Use a distinct name for clarity
const inventarisRoutes = require("./routes/InventarisRoutes"); // Corrected import path
const UserRoutes = require("./routes/UserRoutes");
// Mengimpor 'protect' sebagai 'authenticateToken' dan 'authorize'
const {
  protect: authenticateToken,
  authorize,
} = require("./middleware/authMiddleware");

// Gunakan routes
app.use("/auth", authRoutes); // Rute untuk login dan registrasi
app.use("/keuangan", keuanganRoutes); // Rute untuk manajemen keuangan
app.use("/api/kos", kosRoutes); // Rute untuk manajemen kos
// app.use('/coffee', coffeeShopRoutes); // Keep the old one commented or remove if sure
app.use("/coffee-shop", newCoffeeShopRoutes); // Use the new routes, maybe change path prefix? Let's use /coffee-shop
// Corrected path and applied authentication middleware
app.use("/api/inventaris", authenticateToken, inventarisRoutes); // Corrected path and added auth
// Gunakan middleware otentikasi untuk rute pengguna
app.use("/api/users", authenticateToken, UserRoutes); // Rute untuk mengelola pengguna

// Endpoint utama
app.get("/", (req, res) => {
  res.send("Smartbiz Admin API is running 🚀");
});

// Uji koneksi ke database menggunakan async/await
const testDatabaseConnection = async () => {
  try {
    // pg pool.query returns a result object, access rows via result.rows
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Koneksi ke database berhasil:", result.rows[0]);
  } catch (err) {
    console.error("❌ Koneksi ke database gagal:", err);
  }
};

// Uji koneksi database saat server dijalankan (skip in test environments)
if (process.env.NODE_ENV !== "test") {
  testDatabaseConnection();
}

// Fungsi untuk mereset status pembayaran pada tanggal 1 setiap bulan
const resetPaymentStatusOnFirstOfMonth = async () => {
  const today = new Date();
  if (today.getDate() === 1) {
    // Cek apakah hari ini tanggal 1
    console.log("Tanggal 1 terdeteksi, menjalankan reset status pembayaran...");
    try {
      const result = await pool.query(
        "UPDATE rooms SET payment_status_current_month = 'Belum Bayar' WHERE tenant_name IS NOT NULL"
      );
      console.log(
        `Status pembayaran direset untuk ${result.rowCount} kamar yang terisi.`
      );
    } catch (err) {
      console.error("Gagal mereset status pembayaran:", err);
    }
  } else {
    // console.log('Bukan tanggal 1, reset status pembayaran tidak dijalankan.'); // Bisa dikomentari jika log ini terlalu sering
  }
};

// Hindari menjalankan cron-like job di lingkungan serverless (Vercel)
if (!process.env.VERCEL) {
  resetPaymentStatusOnFirstOfMonth();
}

// Export the app for Vercel serverless. Only listen when running locally.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
