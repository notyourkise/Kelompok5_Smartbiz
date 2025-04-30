// src/controllers/InventarisController.js
const db = require('../config/db'); // Pastikan koneksi database sudah benar

// Ambil semua data inventaris
const getAllInventaris = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM inventory');
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching inventaris:", err);
    res.status(500).json({ error: 'Failed to fetch inventaris' });
  }
};

// Menambahkan inventaris baru
const createInventaris = async (req, res) => {
  const { item_name, stock, minimum_stock } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO inventory (item_name, stock, minimum_stock) VALUES (?, ?, ?)',
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
    const [result] = await db.query(
      'UPDATE inventory SET item_name = ?, stock = ?, minimum_stock = ? WHERE id = ?',
      [item_name, stock, minimum_stock, itemId]
    );
    if (result.affectedRows === 0) {
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
    const [result] = await db.query('DELETE FROM inventory WHERE id = ?', [itemId]);
    if (result.affectedRows === 0) {
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
