# Panduan Pengguna Sistem

## Daftar Isi

1. Pendahuluan
2. Memulai
3. Masuk & Registrasi
   - 3.1. Registrasi
   - 3.2. Login
4. Dashboard
5. Fitur Utama
   - 5.1. Manajemen Kamar Kos
     - List Kamar Kos
     - Tambah Kamar Kos
     - Edit Kamar Kos
     - Hapus Kamar Kos
     - Detail Kamar Kos
   - 5.2. Manajemen Keuangan
     - List Transaksi Keuangan
     - Tambah Transaksi
     - Edit Transaksi
     - Hapus Transaksi
     - Grafik Keuangan
     - Filter & Pencarian
   - 5.3. Manajemen Coffee Shop Menu
     - List Menu
     - Tambah Menu
     - Edit Menu
     - Hapus Menu
     - Detail Menu
     - Filter
   - 5.4. Manajemen User
     - List User
     - Tambah User
     - Edit User
     - Hapus User
     - Detail User
   - 5.5. Manajemen Inventaris
     - List Inventaris
     - Tambah Inventaris
     - Edit Inventaris
     - Hapus Inventaris
     - Detail Inventaris
6. Logout
7. Alur Kerja Sistem
8. Hak Akses & Role
9. Keamanan
10. Catatan Teknis

---

## 1. Pendahuluan

Selamat datang di sistem! Panduan ini akan membantu Anda menggunakan seluruh fitur, mulai dari registrasi hingga keluar dari sistem.

## 2. Memulai

- Buka browser web Anda.
- Akses URL sistem yang diberikan oleh administrator.

## 3. Masuk & Registrasi

### 3.1. Registrasi

- Klik tombol **Register** pada halaman awal jika belum memiliki akun.
- Isi formulir registrasi (username dan password).
- Setelah mengirimkan formulir, data akan divalidasi.
- Jika valid, akun akan dibuat dan Anda dapat langsung login.
- Jika data tidak valid (misal: username sudah terdaftar), sistem akan menampilkan pesan error.

### 3.2. Login

- Masukkan username dan password pada halaman login.
- Klik tombol **Login**.
- Jika berhasil, Anda diarahkan ke **Dashboard**.
- Jika gagal, sistem menampilkan pesan error.

## 4. Dashboard

- Setelah login, Anda akan melihat **Dashboard** yang berisi ringkasan data dan akses ke fitur utama.
- Dashboard menampilkan statistik dan grafik terkait data sistem.

## 5. Fitur Utama

### 5.1. Manajemen Kamar Kos

- **List Kamar Kos:** Menampilkan daftar kamar kos (nomor kamar, status, harga, penghuni, dsb).
- **Tambah Kamar Kos:** Tambah kamar baru dengan mengisi detail kamar.
- **Edit Kamar Kos:** Edit data kamar yang sudah ada.
- **Hapus Kamar Kos:** Hapus data kamar (dengan konfirmasi).
- **Detail Kamar Kos:** Lihat detail kamar, histori penyewaan, status, dan fasilitas.

### 5.2. Manajemen Keuangan

- **List Transaksi Keuangan:** Daftar pemasukan dan pengeluaran dalam tabel.
- **Tambah Transaksi:** Tambah transaksi baru (jenis, nominal, tanggal, deskripsi).
- **Edit Transaksi:** Edit data transaksi.
- **Hapus Transaksi:** Hapus transaksi (dengan konfirmasi).
- **Grafik Keuangan:** Grafik pemasukan dan pengeluaran per periode.
- **Filter & Pencarian:** Filter dan pencarian transaksi berdasarkan jenis, tanggal, nominal, dsb.

### 5.3. Manajemen Coffee Shop Menu

- **List Menu:** Daftar menu coffee shop (nama, harga, kategori, stok, dsb).
- **Tambah Menu:** Tambah menu baru (nama, harga, deksripsi, kategori).
- **Edit Menu:** Edit data menu.
- **Hapus Menu:** Hapus menu (dengan konfirmasi).
- **Detail Menu:** Lihat detail menu dan deskripsi.
- **Filter:** Filter menu berdasarkan kategori.

### 5.4. Manajemen User

- **List User:** Daftar user (username dan password).
- **Tambah User:** (Admin/Superadmin) Tambah user baru secara manual.
- **Edit User:** Edit data user (username/password).
- **Hapus User:** Hapus user (dengan konfirmasi).
- **Detail User:** Lihat detail user (username dan password). Tidak ada fitur pencarian maupun filter.

### 5.5. Manajemen Inventaris

- **List Inventaris:** Daftar barang inventaris (gambar, nama, jumlah, kondisi).
- **Tambah Inventaris:** Tambah barang inventaris baru.
- **Edit Inventaris:** Edit data barang inventaris.
- **Hapus Inventaris:** Hapus barang inventaris (dengan konfirmasi).
- **Detail Inventaris:** Lihat detail barang.

## 6. Logout

- Keluar dari sistem melalui menu profil. Setelah logout, sesi diakhiri dan diarahkan ke halaman login.

## 7. Alur Kerja Sistem (Flow)

1. Akses sistem melalui browser.
2. Registrasi (jika belum punya akun), lalu login.
3. Masuk ke dashboard.
4. Navigasi ke fitur yang diinginkan (kamar kos, keuangan, menu, user, inventaris).
5. Kelola data sesuai kebutuhan.
6. Logout.

## 8. Hak Akses & Role

- Sistem hanya memiliki dua role: **superadmin** dan **admin**.
- **Superadmin** dapat mengakses seluruh fitur sistem.
- **Admin** hanya dapat mengakses manajemen coffee shop menu dan dashboard.

## 9. Keamanan

- Password dienkripsi.
- Validasi data pada setiap input.
- Konfirmasi pada aksi penting (hapus data, dsb).
- Session management untuk keamanan login.

## 10. Catatan Teknis

- Frontend menggunakan framework modern (misal: React/Vite).
- Backend terpisah, komunikasi via REST API.
- Setiap fitur utama memiliki halaman tersendiri dan terhubung melalui menu navigasi.

---

Jika Anda ingin penjelasan lebih detail pada salah satu fitur (misal: flow CRUD pada manajemen kamar kos atau diagram alur), silakan informasikan!
