const db = require('../config/db');

// Fungsi untuk mendapatkan semua data transaksi (income & expense)
const getAllTransactionsDetail = async (req, res) => {
  const category = req.query.category; // Mengambil kategori dari query parameter
  const period = req.query.period; // Mengambil periode dari query parameter

  let sql = `
    SELECT t.id, t.type, t.amount, t.description, t.category, t.payment_method,
           TO_CHAR(t.created_at, 'YYYY-MM-DD HH24:MI:SS') as created_at, 
           u.username as created_by_username 
    FROM TRANSACTIONS t
    JOIN users u ON t.created_by = u.id
  `; // Alias created_by diubah agar tidak konflik jika ada kolom created_by di t

  const queryParams = [];
  let whereClauses = [];
  let paramIndex = 1;

  if (category) {
    whereClauses.push(`LOWER(t.category) = LOWER($${paramIndex++})`);
    queryParams.push(category);
  }

  if (period && period !== 'allTime') { // 'allTime' atau tidak ada periode berarti tidak ada filter tanggal
    const now = new Date();
    let startDateExpression = '';

    switch (period) {
      case 'today':
        startDateExpression = `DATE_TRUNC('day', NOW())`;
        whereClauses.push(`t.created_at >= ${startDateExpression} AND t.created_at < ${startDateExpression} + INTERVAL '1 day'`);
        break;
      case 'last7days':
        startDateExpression = `DATE_TRUNC('day', NOW() - INTERVAL '6 days')`;
        whereClauses.push(`t.created_at >= ${startDateExpression} AND t.created_at < DATE_TRUNC('day', NOW()) + INTERVAL '1 day'`);
        break;
      case 'thisMonth':
        startDateExpression = `DATE_TRUNC('month', NOW())`;
        whereClauses.push(`t.created_at >= ${startDateExpression} AND t.created_at < ${startDateExpression} + INTERVAL '1 month'`);
        break;
      case 'thisYear':
        startDateExpression = `DATE_TRUNC('year', NOW())`;
        whereClauses.push(`t.created_at >= ${startDateExpression} AND t.created_at < ${startDateExpression} + INTERVAL '1 year'`);
        break;
      // Tidak perlu case untuk 'allTime' karena itu berarti tidak ada filter tanggal tambahan
    }
  }

  if (whereClauses.length > 0) {
    sql += ` WHERE ` + whereClauses.join(' AND ');
  }

  sql += ` ORDER BY t.created_at DESC`; // Umumnya lebih baik melihat data terbaru di atas

  console.log("Executing SQL:", sql); // DEBUG
  console.log("With Query Params:", queryParams); // DEBUG

  try {
    const result = await db.query(sql, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error mengambil data transaksi:', err);
    res.status(500).json({ error: 'Gagal mengambil data transaksi' });
  }
};

// Fungsi untuk menambahkan transaksi baru
const createTransactionDetail = async (req, res) => {
  const { type, amount, description, category, payment_method } = req.body;
  const created_by = req.user.id; 

  if (!type || !amount || !created_by || !category) {
    return res.status(400).json({ error: 'Semua kolom wajib diisi: type, amount, category, dan created_by (admin).' });
  }
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    return res.status(400).json({ error: 'Jumlah (amount) harus berupa angka.' });
  }


  const sql = `
    INSERT INTO TRANSACTIONS
      (type, amount, description, category, payment_method, created_at, updated_at, created_by)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6)
    RETURNING * 
  `;

  try {
    const result = await db.query(sql, [type, numericAmount, description, category, payment_method, created_by]);

    if (result.rows.length > 0) {
      const newTransaction = result.rows[0];
      // Format created_at jika perlu, atau biarkan frontend yang format
      // newTransaction.created_at = new Date(newTransaction.created_at).toISOString().replace('T', ' ').substring(0, 19); 
      res.status(201).json(newTransaction); 
    } else {
      res.status(500).json({ error: 'Gagal menambahkan transaksi, tidak ada baris yang dikembalikan.' });
    }
  } catch (err) {
    console.error('❌ Error saat menambahkan transaksi:', err);
    res.status(500).json({ error: 'Gagal menambahkan transaksi internal server.' });
  }
};

// Fungsi untuk mengupdate transaksi
const updateTransactionDetail = async (req, res) => {
  const transactionId = req.params.id;
  const { type, amount, description, payment_method, category } = req.body; // Tambahkan category jika bisa diupdate
  // const updated_by = req.user.id; // Jika Anda ingin melacak siapa yang mengupdate

  if (!type || amount === undefined || !description || !payment_method || !category) {
    return res.status(400).json({ error: 'Semua kolom (type, amount, description, category, payment_method) wajib diisi untuk update' });
  }
  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount)) {
    return res.status(400).json({ error: 'Jumlah (amount) harus berupa angka.' });
  }

  const sql = `
    UPDATE TRANSACTIONS
    SET type = $1, amount = $2, description = $3, payment_method = $4, category = $5, updated_at = NOW()
    WHERE id = $6
    RETURNING *; -- Mengembalikan baris yang diupdate
  `;

  try {
    const result = await db.query(sql, [type, numericAmount, description, payment_method, category, transactionId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    res.status(200).json({ message: 'Transaksi berhasil diperbarui', transaction: result.rows[0] });
  } catch (err) {
    console.error('❌ Error saat mengupdate transaksi:', err);
    res.status(500).json({ error: 'Gagal mengupdate transaksi' });
  }
};

// Fungsi untuk menghapus transaksi
const deleteTransactionDetail = async (req, res) => {
  const transactionId = req.params.id;

  const sql = `DELETE FROM TRANSACTIONS WHERE id = $1 RETURNING id;`; // RETURNING id untuk konfirmasi

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

module.exports = {
  getAllTransactionsDetail,
  createTransactionDetail,
  updateTransactionDetail, 
  deleteTransactionDetail, 
};
