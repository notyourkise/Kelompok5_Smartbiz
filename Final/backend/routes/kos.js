const express = require('express');
const router = express.Router();
const path = require('path'); // Diperlukan untuk path.extname
const fs = require('fs'); // Diperlukan untuk membuat direktori jika belum ada
const multer = require('multer'); // Impor multer

const {
  getAllKosRooms,
  getKosRoomById,
  createKosRoom,
  updateKosRoom,
  deleteKosRoom,
  getPaymentHistoryByRoomId,
  addPembayaranKos,
  updateStatusPembayaranKos
} = require('../controllers/kosController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Konfigurasi Multer untuk penyimpanan file bukti pembayaran
const UPLOAD_DIR = 'uploads/bukti_pembayaran_kos/';

// Pastikan direktori upload ada, jika tidak buat direktorinya
if (!fs.existsSync(UPLOAD_DIR)){
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR); // Tentukan folder penyimpanan
  },
  filename: function (req, file, cb) {
    // Buat nama file yang unik: fieldname-timestamp.extension
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Hanya izinkan file gambar
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Menyimpan error di req agar bisa diakses di middleware berikutnya
    req.fileValidationError = 'Hanya file gambar yang diizinkan! (jpg, jpeg, png, gif)';
    cb(null, false); // Tetap panggil cb(null, false) untuk menolak file
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter, 
  limits: { fileSize: 10 * 1024 * 1024 } // Batas ukuran file dinaikkan menjadi 10MB
});

// Rute untuk Kamar Kos
router.route('/')
  .get(protect, authorize(['superadmin', 'admin']), getAllKosRooms)
  .post(protect, authorize(['superadmin']), createKosRoom);

router.route('/:id')
  .get(protect, authorize(['superadmin', 'admin']), getKosRoomById)
  .put(protect, authorize(['superadmin']), updateKosRoom)
  .delete(protect, authorize(['superadmin']), deleteKosRoom);

// Rute untuk riwayat pembayaran untuk kamar tertentu
router.route('/:roomId/payment-history') // :roomId adalah rooms.id
  .get(protect, authorize(['superadmin', 'admin']), getPaymentHistoryByRoomId);

// Rute Baru untuk Pembayaran Kos
router.route('/pembayaran')
    .post(
        protect,
        authorize(['superadmin', 'admin']),
        (req, res, next) => { // Middleware custom untuk menangani error multer dengan lebih baik
            const multerUpload = upload.single('buktiTransferImage');
            multerUpload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    // Error dari Multer (misalnya, file terlalu besar)
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ message: `File terlalu besar. Maksimum ${upload.limits.fileSize / (1024*1024)}MB.` });
                    }
                    console.error("Multer Error (handled):", err); // Log error multer yang ditangani
                    return res.status(400).json({ message: `Multer error: ${err.message}` });
                } else if (err) {
                    // Error lain saat upload
                    console.error("Internal Multer/Upload Error:", err); // TAMBAHKAN LOG INI
                    return res.status(500).json({ message: `Error upload file: ${err.message}` });
                }
                // Jika ada error validasi dari fileFilter
                if (req.fileValidationError) {
                    return res.status(400).json({ message: req.fileValidationError });
                }
                next(); // Lanjut jika tidak ada error multer
            });
        },
        (req, res, next) => { // Middleware untuk memproses path file
            if (req.file) {
              req.body.bukti_transfer_path = req.file.path.replace(/\\/g, "/");
            }
            console.log("Processed req.body before addPembayaranKos:", JSON.stringify(req.body, null, 2)); // TAMBAHKAN LOG INI (dengan JSON.stringify)
            next();
        },
        addPembayaranKos
    );

router.route('/pembayaran/:paymentId/status') // :paymentId adalah pembayaran_kos.id
    .put(protect, authorize(['superadmin', 'admin']), updateStatusPembayaranKos);

module.exports = router;
