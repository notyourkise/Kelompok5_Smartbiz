// Fungsi untuk membuat user baru
const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // SaltRounds: 10

    // Simpan user baru ke database
    const [result] = await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Fungsi untuk login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Ambil user berdasarkan username
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = rows[0];

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Jika password cocok, buat JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      "your-secret-key"
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Menghapus pengguna
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan" });
    }

    res.status(200).json({ message: "Pengguna berhasil dihapus" });
  } catch (err) {
    console.error("❌ Error menghapus pengguna:", err);
    res.status(500).json({ error: "Gagal menghapus pengguna" });
  }
};

// Ekspor fungsi
module.exports = {
  getAllUsers,
  deleteUser,
  createUser,
  updateUser, // Pastikan createUser sudah diekspor setelah deklarasi
};
