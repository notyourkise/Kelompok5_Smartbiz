const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware untuk otentikasi token
const protect = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token tidak ditemukan. Akses ditolak." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    // Verify with environment secret
    if (err) {
      console.error("JWT Verification Error:", err.message);

      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: "Token telah kedaluwarsa. Silakan login kembali." });
      }

      return res
        .status(403)
        .json({ error: "Token tidak valid atau kadaluarsa." });
    }

    // Token valid, user akan berisi payload { id, username, role }
    req.user = user; // Menyimpan informasi pengguna di request object

    next(); // Lanjut ke route controller atau middleware berikutnya
  });
};

// Middleware untuk otorisasi berdasarkan peran (role)
const authorize = (roles = []) => {
  // roles bisa berupa string tunggal (misalnya 'admin') atau array string (misalnya ['superadmin', 'admin'])
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ error: "Akses ditolak. Peran pengguna tidak diketahui." });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      // Pengguna tidak memiliki peran yang diizinkan
      return res
        .status(403)
        .json({
          error: `Akses ditolak. Anda tidak memiliki peran sebagai ${roles.join(
            " atau "
          )}.`,
        });
    }

    // Pengguna memiliki peran yang diizinkan
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
