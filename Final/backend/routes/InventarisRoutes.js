// src/routes/InventarisRoutes.js
const express = require("express");
const router = express.Router();
const inventarisController = require("../controllers/InventarisController"); // Pastikan path ke controller benar

// GET semua inventaris
router.get("/", inventarisController.getAllInventaris);

// POST untuk menambahkan inventaris baru
router.post("/", inventarisController.createInventaris);

// PUT untuk mengupdate inventaris
router.put("/:id", inventarisController.updateInventaris);

// DELETE untuk menghapus inventaris
router.delete("/:id", inventarisController.deleteInventaris);

module.exports = router;
