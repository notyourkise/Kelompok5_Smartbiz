const db = require('../config/db');

// Ambil semua data transaksi (income & expense)
const getAllTransactionsDetail = (req, res) => {
  const sql = `
    SELECT t.id, t.type, t.amount, t.description, t.category, t.payment_method,
           DATE_FORMAT(t.created_at, '%Y-%m-%d') as tanggal,
           u.username as created_by
    FROM TRANSACTIONS t
    JOIN users u ON t.created_by = u.id
    ORDER BY t.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error mengambil data transaksi:', err);
      return res.status(500).json({ error: 'Gagal mengambil data transaksi' });
    }

    res.status(200).json(results);
  });
};

// Tambah transaksi baru
const createTransactionDetail = (req, res) => {
  const { type, amount, description, category, payment_method, created_by } = req.body;

  if (!type || !amount || !created_by) {
    return res.status(400).json({ error: 'Kolom wajib (type, amount, created_by) harus diisi' });
  }

  const sql = `
    INSERT INTO TRANSACTIONS 
      (type, amount, description, category, payment_method, created_at, updated_at, created_by)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?)
  `;

  db.query(sql, [type, amount, description, category, payment_method, created_by], (err, result) => {
    if (err) {
      console.error('❌ Error saat menambahkan transaksi:', err);
      return res.status(500).json({ error: 'Gagal menambahkan data transaksi' });
    }

    res.status(201).json({
      message: 'Transaksi berhasil ditambahkan',
      id: result.insertId,
    });
  });
};

module.exports = {
  getAllTransactionsDetail,
  createTransactionDetail,
};
