const db = require('../config/db');

// Fungsi untuk mendapatkan semua data transaksi (income & expense)
const getAllTransactionsDetail = async (req, res) => {
  const category = req.query.category; // Mengambil kategori dari query parameter

  const sql = `
    SELECT t.id, t.type, t.amount, t.description, t.category, t.payment_method,
           DATE_FORMAT(t.created_at, '%Y-%m-%d %H:%i:%s') as tanggal,
           u.username as created_by
    FROM TRANSACTIONS t
    JOIN users u ON t.created_by = u.id
    WHERE t.category = ?  -- Menggunakan kategori dari query
    ORDER BY t.created_at ASC
  `;

  try {
    // Menggunakan await untuk menunggu hasil query
    const [results] = await db.query(sql, [category]);  // Menggunakan Promise API
    res.status(200).json(results);  // Kirimkan data transaksi ke frontend
  } catch (err) {
    console.error('❌ Error mengambil data transaksi:', err);
    res.status(500).json({ error: 'Gagal mengambil data transaksi' });
  }
};

// Fungsi untuk menambahkan transaksi baru
const createTransactionDetail = async (req, res) => {
  const { type, amount, description, category, payment_method } = req.body;

  // Ambil created_by dari user yang sedang login (dari token JWT)
  const created_by = req.user.id;  // Pastikan req.user.id sudah ada setelah JWT di-decode

  if (!type || !amount || !created_by || !category) {
    return res.status(400).json({ error: 'Semua kolom wajib diisi' });
  }

  const sql = `
    INSERT INTO TRANSACTIONS 
      (type, amount, description, category, payment_method, created_at, updated_at, created_by)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)
  `;

  try {
    // Menambahkan transaksi
    const [result] = await db.query(sql, [type, amount, description, category, payment_method, created_by]);

    // Check if insert was successful
    if (result.affectedRows > 0) {
      res.status(201).json({
        message: 'Transaksi berhasil ditambahkan',
        id: result.insertId,
      });
    } else {
      res.status(500).json({ error: 'Gagal menambahkan transaksi' });
    }
  } catch (err) {
    console.error('❌ Error saat menambahkan transaksi:', err);
    res.status(500).json({ error: 'Gagal menambahkan transaksi' });
  }
};

// Ekspor semua fungsi
module.exports = {
  getAllTransactionsDetail,
  createTransactionDetail,
};
