// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // Sesuaikan jika username berbeda
  host: 'localhost',
  database: 'Smartbiz-Admin', // Nama database kamu
  password: 'post',     // Ganti jika password PostgreSQL kamu berbeda
  port: 5432,
});

module.exports = pool;