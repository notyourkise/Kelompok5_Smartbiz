// src/controllers/InventarisController.js
const db = require('../config/db'); // Pastikan koneksi database sudah benar

// Ambil semua data inventaris, filter by category if provided
const getAllInventaris = async (req, res) => {
  const category = req.query.category; // Get category from query parameter

  let sql = 'SELECT * FROM inventory';
  const params = [];

  if (category) {
    sql += ' WHERE LOWER(category) = LOWER($1)'; // Case-insensitive filter
    params.push(category);
  }

  sql += ' ORDER BY item_name ASC'; // Optional: order results

  try {
    const result = await db.query(sql, params); // Use params array
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching inventaris:", err);
    res.status(500).json({ error: 'Failed to fetch inventaris' });
  }
};

// Menambahkan inventaris baru
const createInventaris = async (req, res) => {
  const { item_name, stock, minimum_stock, category } = req.body;

  try {
    // Tambahkan category pada saat insert data
    await db.query(
      'INSERT INTO inventory (item_name, stock, minimum_stock, category) VALUES ($1, $2, $3, $4)',
      [item_name, stock, minimum_stock, category] // Include category here
    );
    res.status(201).json({ message: 'Inventaris created successfully' });
  } catch (err) {
    console.error("Error creating inventaris:", err);
    res.status(500).json({ error: 'Failed to create inventaris' });
  }
};

// Mengupdate inventaris
const updateInventaris = async (req, res) => {
  const itemId = req.params.id;
  const { item_name, stock, minimum_stock, category } = req.body; // Menambahkan kategori

  try {
    const result = await db.query(
      'UPDATE inventory SET item_name = $1, stock = $2, minimum_stock = $3, category = $4 WHERE id = $5',
      [item_name, stock, minimum_stock, category, itemId] // Menyertakan category
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inventaris not found' });
    }
    res.status(200).json({ message: 'Inventaris updated successfully' });
  } catch (err) {
    console.error("Error updating inventaris:", err);
    res.status(500).json({ error: 'Failed to update inventaris' });
  }
};

// Menghapus inventaris
const deleteInventaris = async (req, res) => {
  const itemId = req.params.id;

  try {
    const result = await db.query('DELETE FROM inventory WHERE id = $1', [itemId]);
    // Use rowCount for pg
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inventaris not found' });
    }
    res.status(200).json({ message: 'Inventaris deleted successfully' });
  } catch (err) {
    console.error("Error deleting inventaris:", err);
    res.status(500).json({ error: 'Failed to delete inventaris' });
  }
};

module.exports = {
  getAllInventaris,
  createInventaris,
  updateInventaris,
  deleteInventaris
};
