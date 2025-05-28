// src/controllers/InventarisController.js
const db = require('../config/db'); // Pastikan koneksi database sudah benar
const path = require('path');
const fs = require('fs');

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
  const { item_name, stock, minimum_stock, category, expiration_date } = req.body;
  const image = req.file;

  try {
    let imageUrl = null;
    if (image) {
      imageUrl = `uploads/inventaris/${image.filename}`;
    }

    await db.query(
      'INSERT INTO inventory (item_name, stock, minimum_stock, category, image_url, expiration_date) VALUES ($1, $2, $3, $4, $5, $6)',
      [item_name, stock, minimum_stock, category, imageUrl, expiration_date]
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
  const { item_name, stock, minimum_stock, category, expiration_date } = req.body;
  const image = req.file;

  try {
    let imageUrl = null;
    if (image) {
      imageUrl = `uploads/inventaris/${image.filename}`;
      // Optional: Delete old image if it exists
      const oldItem = await db.query('SELECT image_url FROM inventory WHERE id = $1', [itemId]);
      if (oldItem.rows.length > 0 && oldItem.rows[0].image_url) {
        const oldImagePath = path.join(__dirname, '../', oldItem.rows[0].image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    } else if (req.body.image_url === '') {
        // Handle case where image is explicitly removed
        const oldItem = await db.query('SELECT image_url FROM inventory WHERE id = $1', [itemId]);
        if (oldItem.rows.length > 0 && oldItem.rows[0].image_url) {
            const oldImagePath = path.join(__dirname, '../', oldItem.rows[0].image_url);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        imageUrl = null; // Set image_url to null in DB
    }


    const result = await db.query(
      'UPDATE inventory SET item_name = $1, stock = $2, minimum_stock = $3, category = $4, image_url = $5, expiration_date = $6 WHERE id = $7',
      [item_name, stock, minimum_stock, category, imageUrl, expiration_date, itemId]
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
    // Optional: Delete associated image before deleting the item
    const oldItem = await db.query('SELECT image_url FROM inventory WHERE id = $1', [itemId]);
    if (oldItem.rows.length > 0 && oldItem.rows[0].image_url) {
      const oldImagePath = path.join(__dirname, '../', oldItem.rows[0].image_url);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

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