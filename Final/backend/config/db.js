// config/db.js

const mysql = require('mysql2/promise'); // Import promise wrapper

// Membuat koneksi ke database MySQL
const pool = mysql.createPool({
  host: 'localhost', // Ganti dengan host database Anda
  user: 'root',       // Ganti dengan username MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'smartbizadmin',  // Ganti dengan nama database Anda
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
