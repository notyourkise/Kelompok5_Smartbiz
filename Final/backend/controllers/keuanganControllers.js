const db = require('../config/db');

// Fungsi untuk mendapatkan semua data transaksi (income & expense)
const getAllTransactionsDetail = async (req, res) => {
  const category = req.query.category; // Mengambil kategori dari query parameter

const sql = `
    SELECT t.id, t.type, t.amount, t.description, t.category, t.payment_method,
           TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at, -- PostgreSQL date format
           u.username as created_by
    FROM TRANSACTIONS t
    JOIN users u ON t.created_by = u.id
    WHERE LOWER(t.category) = LOWER($1)  -- Case-insensitive comparison
    ORDER BY t.created_at ASC
  `;

  try {
    // Menggunakan await untuk menunggu hasil query
    const result = await db.query(sql, [category]);  // Use pg syntax
    res.status(200).json(result.rows);  // Kirimkan data transaksi ke frontend using result.rows
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
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6) -- Use pg placeholders
    RETURNING * -- Return the newly inserted row
  `;

  try {
    // Menambahkan transaksi
    const result = await db.query(sql, [type, amount, description, category, payment_method, created_by]);

    // Check if insert was successful and return the new transaction data
    if (result.rows.length > 0) {
      // Format the created_at date before sending
      const newTransaction = result.rows[0];
      newTransaction.created_at = new Date(newTransaction.created_at).toISOString().replace('T', ' ').substring(0, 19); // Format to 'YYYY-MM-DD HH:MI:SS'
      res.status(201).json(newTransaction); // Send the full new transaction object
    } else {
      res.status(500).json({ error: 'Gagal menambahkan transaksi' });
    }
  } catch (err) {
    console.error('❌ Error saat menambahkan transaksi:', err);
    res.status(500).json({ error: 'Gagal menambahkan transaksi' });
  }
};

// Fungsi untuk mengupdate transaksi
const updateTransactionDetail = async (req, res) => {
  const transactionId = req.params.id;
  const { type, amount, description, payment_method } = req.body;
  const updated_by = req.user.id; // Assuming user ID is available from auth middleware

  // Basic validation
  if (!type || !amount || !description || !payment_method) {
    return res.status(400).json({ error: 'Semua kolom wajib diisi untuk update' });
  }

  const sql = `
    UPDATE TRANSACTIONS
    SET type = $1, amount = $2, description = $3, payment_method = $4, updated_at = NOW()
    WHERE id = $5
  `;

  try {
    const result = await db.query(sql, [type, amount, description, payment_method, transactionId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    res.status(200).json({ message: 'Transaksi berhasil diperbarui' });
  } catch (err) {
    console.error('❌ Error saat mengupdate transaksi:', err);
    res.status(500).json({ error: 'Gagal mengupdate transaksi' });
  }
};

// Fungsi untuk menghapus transaksi
const deleteTransactionDetail = async (req, res) => {
  const transactionId = req.params.id;

  const sql = `DELETE FROM TRANSACTIONS WHERE id = $1`;

  try {
    const result = await db.query(sql, [transactionId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    res.status(200).json({ message: 'Transaksi berhasil dihapus' });
  } catch (err) {
    console.error('❌ Error saat menghapus transaksi:', err);
    res.status(500).json({ error: 'Gagal menghapus transaksi' });
  }
};

// Ekspor semua fungsi
module.exports = {
  getAllTransactionsDetail,
  createTransactionDetail,
  updateTransactionDetail, // Now defined before export
  deleteTransactionDetail, // Now defined before export
};
