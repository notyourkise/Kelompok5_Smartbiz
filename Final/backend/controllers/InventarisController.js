// src/controllers/InventarisController.js
const db = require('../config/db'); // Pastikan koneksi database sudah benar

// Ambil semua data inventaris
const getAllInventaris = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inventory');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching inventaris:", err);
    res.status(500).json({ error: 'Failed to fetch inventaris' });
  }
};

// Menambahkan inventaris baru
const createInventaris = async (req, res) => {
  const { item_name, stock, minimum_stock } = req.body;

  try {
    // pg returns a result object, no need to destructure. Success is implied if no error.
    await db.query(
      'INSERT INTO inventory (item_name, stock, minimum_stock) VALUES ($1, $2, $3)',
      [item_name, stock, minimum_stock]
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
  const { item_name, stock, minimum_stock } = req.body;

  try {
    const result = await db.query(
      'UPDATE inventory SET item_name = $1, stock = $2, minimum_stock = $3 WHERE id = $4',
      [item_name, stock, minimum_stock, itemId]
    );
    // Use rowCount for pg
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
