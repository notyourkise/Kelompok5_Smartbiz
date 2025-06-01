# Guidebook Sistem SmartBizAdmin

## Pendahuluan

Selamat datang di Guidebook Sistem SmartBizAdmin. Dokumen ini dirancang untuk membantu pengguna memahami dan mengoperasikan sistem SmartBizAdmin, sebuah platform manajemen terpadu untuk bisnis kost dan coffee shop. Sistem ini memungkinkan pengelolaan inventaris, keuangan, pengguna, serta operasional spesifik untuk masing-masing jenis bisnis.

## Persyaratan Sistem

Untuk menjalankan sistem SmartBizAdmin dengan optimal, pastikan lingkungan Anda memenuhi persyaratan berikut:

*   **Sistem Operasi:** Windows, macOS, atau Linux.
*   **Browser Web:** Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari versi terbaru.
*   **Koneksi Internet:** Diperlukan untuk akses penuh ke fitur berbasis cloud (jika ada) dan pembaruan.
*   **Spesifikasi Hardware:**
    *   RAM: Minimal 4GB (disarankan 8GB atau lebih).
    *   Penyimpanan: Minimal 100MB ruang kosong untuk aplikasi.

## Instalasi dan Setup (Untuk Pengembang/Administrator Teknis)

Bagian ini ditujukan bagi mereka yang bertanggung jawab untuk menginstal atau mengatur ulang sistem.

### 3.1 Persiapan Lingkungan

1.  **Node.js:** Pastikan Node.js (versi LTS disarankan) dan npm (Node Package Manager) terinstal.
2.  **Database:** Sistem ini menggunakan database MySQL. Pastikan MySQL server terinstal dan berjalan.
3.  **Kloning Repositori:** Dapatkan kode sumber sistem dari repositori yang disediakan.

### 3.2 Konfigurasi Backend

1.  Navigasi ke direktori `Final/backend`.
2.  Instal dependensi: `npm install`.
3.  Konfigurasi database di `Final/backend/config/db.js` (sesuaikan kredensial database Anda).
4.  Jalankan migrasi database (jika ada) atau impor file `smartbizadmin.sql` ke database MySQL Anda.
5.  Jalankan server backend: `npm start` atau `node index.js`.

### 3.3 Konfigurasi Frontend

1.  Navigasi ke direktori `Final/frontend-app`.
2.  Instal dependensi: `npm install`.
3.  Pastikan backend berjalan sebelum menjalankan frontend.
4.  Jalankan aplikasi frontend: `npm run dev`.
5.  Aplikasi akan terbuka di browser Anda, biasanya di `http://localhost:5173` atau port lain yang tersedia.

## Bab 1: Login dan Registrasi

### 1.1 Registrasi Akun Baru

Jika Anda belum memiliki akun, ikuti langkah-langkah berikut untuk mendaftar:
1.  **Akses Halaman Registrasi:** Buka browser web Anda dan navigasikan ke URL sistem SmartBizAdmin. Cari dan klik tautan "Daftar" atau "Register" yang biasanya terletak di halaman login.
2.  **Isi Formulir Pendaftaran:** Anda akan melihat formulir yang meminta informasi seperti:
    *   **Username:** Nama pengguna unik yang akan Anda gunakan untuk login.
    *   **Email:** Alamat email valid Anda.
    *   **Password:** Kata sandi yang kuat (disarankan kombinasi huruf besar, huruf kecil, angka, dan simbol).
    *   **Konfirmasi Password:** Masukkan kembali kata sandi Anda untuk memastikan tidak ada kesalahan ketik.
3.  **Kirim Pendaftaran:** Setelah semua kolom terisi dengan benar, klik tombol "Daftar" atau "Register".
4.  **Verifikasi dan Konfirmasi:** Sistem akan memproses pendaftaran Anda. Anda mungkin akan menerima email verifikasi (jika diaktifkan) atau langsung diarahkan ke halaman login dengan pesan konfirmasi bahwa akun Anda berhasil dibuat.

### 1.2 Login ke Sistem

Untuk masuk ke sistem, ikuti langkah-langkah berikut:
1.  **Akses Halaman Login:** Buka browser web Anda dan navigasikan ke URL sistem SmartBizAdmin.
2.  **Masukkan Kredensial:** Pada halaman login, masukkan:
    *   **Username/Email:** Nama pengguna atau alamat email yang Anda gunakan saat mendaftar.
    *   **Password:** Kata sandi akun Anda.
3.  **Klik Tombol Login:** Setelah memasukkan kredensial, klik tombol "Login" atau "Masuk".
4.  **Pengalihan Dashboard:** Jika kredensial benar, Anda akan berhasil masuk dan diarahkan ke dashboard utama sistem. Dashboard yang ditampilkan akan berbeda tergantung pada peran (role) akun Anda (Super Admin atau Admin).

## Bab 2: Peran Super Admin

Setelah berhasil login, pengguna dengan peran Super Admin akan memiliki akses penuh ke semua fitur dan manajemen sistem. Peran ini dirancang untuk administrator utama yang bertanggung jawab atas konfigurasi, pengawasan, dan pengelolaan menyeluruh sistem. Berikut adalah penjelasan detail mengenai hak akses dan fitur yang tersedia untuk Super Admin:

### 2.1 Dashboard Super Admin

Dashboard Super Admin adalah pusat kendali utama yang menyediakan gambaran umum komprehensif tentang status sistem. Halaman ini menampilkan informasi penting secara sekilas dan memungkinkan akses cepat ke berbagai modul manajemen.

**Elemen-elemen pada Dashboard:**

*   **Pesan Selamat Datang dan Informasi Peran:** Di bagian atas, Anda akan melihat pesan "Selamat Datang, [Nama Pengguna]!" dan informasi peran Anda (misalnya, "Role: superadmin"). Ini mengkonfirmasi bahwa Anda telah berhasil login dengan akun Super Admin.
*   **Tanggal dan Waktu:** Menampilkan tanggal dan waktu saat ini.
*   **Ringkasan Statistik:** Bagian ini menyajikan kartu-kartu ringkasan yang menampilkan data kunci operasional:
    *   **Total Pengguna:** Jumlah total akun pengguna yang terdaftar dalam sistem.
    *   **Pendapatan:** Total pendapatan yang tercatat dalam periode waktu yang dipilih (misalnya, "Bulan Ini").
    *   **Pengeluaran:** Total pengeluaran yang tercatat dalam periode waktu yang dipilih.
    *   **Kamar Tersedia:** Jumlah kamar kos yang saat ini tersedia.
    *   **Item Menu Coffee Shop:** Jumlah total item menu yang terdaftar di coffee shop.
    *   **Selisih:** Perbedaan antara pendapatan dan pengeluaran dalam periode waktu yang dipilih.
*   **Filter Periode Waktu:** Terdapat opsi untuk memfilter data statistik berdasarkan periode waktu tertentu (misalnya, "Bulan Ini").

**Navigasi Sidebar Kiri:**

Sidebar navigasi di sisi kiri layar memungkinkan Super Admin untuk mengakses berbagai modul sistem dengan mudah:

*   **Dashboard:** Kembali ke halaman ringkasan dashboard utama.
*   **Manajemen Keuangan:** Modul untuk mengelola semua aspek keuangan. Ini memiliki sub-menu untuk:
    *   **Keuangan Kost:** Mengelola pemasukan dan pengeluaran terkait bisnis kost.
    *   **Keuangan Coffee Shop:** Mengelola pemasukan dan pengeluaran terkait bisnis coffee shop.
*   **Manajemen Kamar Kos:** Modul khusus untuk mengelola informasi kamar, penghuni, dan detail operasional kost.
*   **Coffee Shop Menu:** Modul khusus untuk mengelola daftar menu, harga, dan detail lain terkait operasional coffee shop.
*   **Manajemen User:** Modul untuk mengelola semua akun pengguna dalam sistem (menambah, mengedit, menghapus, dan mengubah peran).
*   **Inventaris:** Modul untuk mengelola inventaris. Ini memiliki sub-menu untuk:
    *   **Inventaris Kost:** Mengelola inventaris yang digunakan dalam bisnis kost.
    *   **Inventaris Coffee Shop:** Mengelola inventaris yang digunakan dalam bisnis coffee shop.
*   **Tentang Kami:** Halaman yang mungkin berisi informasi tentang sistem atau pengembang.

### 2.2 Manajemen Pengguna (User Management)

Modul ini memungkinkan Super Admin untuk mengelola semua aspek akun pengguna dalam sistem.
*   **Melihat Daftar Pengguna:** Menampilkan tabel semua pengguna terdaftar dengan detail seperti username, email, peran, dan status akun. (Lihat Gambar: Manajemen Pengguna - Daftar)
*   **Menambah Pengguna Baru:** Membuat akun pengguna baru. Super Admin dapat menentukan username, email, password, dan yang terpenting, menetapkan peran (Super Admin atau Admin) untuk akun baru tersebut. (Lihat Gambar: Manajemen Pengguna - Tambah Pengguna)
*   **Mengedit Informasi Pengguna:** Memperbarui detail akun pengguna yang sudah ada, termasuk username, email, dan peran. Ini juga memungkinkan reset password pengguna. (Lihat Gambar: Manajemen Pengguna - Edit Pengguna)
*   **Menghapus Pengguna:** Menghapus akun pengguna dari sistem secara permanen. Tindakan ini memerlukan konfirmasi untuk mencegah penghapusan yang tidak disengaja. (Lihat Gambar: Manajemen Pengguna - Hapus Pengguna)
*   **Mengelola Peran Pengguna:** Mengubah peran pengguna yang sudah ada antara Super Admin dan Admin. Fitur ini krusial untuk delegasi tugas dan penyesuaian hak akses.

### 2.3 Manajemen Inventaris

Super Admin memiliki kontrol penuh atas inventaris untuk kedua jenis bisnis (Kost dan Coffee Shop).
*   **Inventaris Kost:** Mengelola daftar inventaris yang terkait dengan operasional kost, seperti perabot kamar, peralatan kebersihan, dll. Super Admin dapat menambah, mengedit, menghapus item, dan memperbarui jumlah stok. (Lihat Gambar: Manajemen Inventaris Kost)
*   **Inventaris Coffee Shop:** Mengelola daftar inventaris yang terkait dengan operasional coffee shop, seperti bahan baku kopi, peralatan dapur, dll. Sama seperti inventaris kost, Super Admin dapat melakukan CRUD (Create, Read, Update, Delete) dan manajemen stok. (Lihat Gambar: Manajemen Inventaris Coffee Shop)
*   **Penambahan/Pengurangan Stok:** Melakukan update jumlah stok inventaris secara manual atau melalui proses transaksi.
*   **Laporan Inventaris:** Mengakses laporan detail mengenai ketersediaan, pergerakan, dan nilai inventaris. Laporan ini dapat difilter berdasarkan jenis bisnis atau periode waktu.

### 2.4 Manajemen Keuangan

Super Admin memiliki kontrol penuh atas modul keuangan untuk kedua jenis bisnis, memungkinkan pengawasan dan analisis finansial yang mendalam.
*   **Keuangan Kost:** Memantau semua pemasukan (misalnya, pembayaran sewa) dan pengeluaran (misalnya, biaya operasional) yang terkait dengan kost. (Lihat Gambar: Manajemen Keuangan Kost)
*   **Keuangan Coffee Shop:** Modul ini menyediakan tampilan komprehensif mengenai data keuangan coffee shop. (Lihat Gambar: Manajemen Keuangan Coffee Shop)
    *   **Navigasi:** Terdapat tombol panah kembali untuk navigasi ke halaman sebelumnya.
    *   **Filter Waktu:** Anda dapat memfilter data keuangan berdasarkan periode waktu tertentu (misalnya, "Semua Waktu", "Bulan Ini", dll.) menggunakan dropdown "Filter: Semua Waktu".
    *   **Grafik Distribusi Pemasukan vs Pengeluaran:** Diagram donat ini secara visual menunjukkan proporsi antara total pemasukan dan pengeluaran dalam periode yang dipilih.
    *   **Grafik Perbandingan Pemasukan dan Pengeluaran per Bulan:** Diagram batang ini menampilkan perbandingan jumlah pemasukan dan pengeluaran untuk setiap bulan, memungkinkan Anda melihat tren finansial dari waktu ke waktu.
    *   **Tombol Tambah Transaksi:** Klik tombol "+ Tambah Transaksi" untuk mencatat transaksi pemasukan atau pengeluaran baru secara manual.
    *   **Tombol Cetak:** Tombol "Cetak" memungkinkan Anda untuk mencetak laporan keuangan atau mengekspornya dalam format tertentu (misalnya, PDF, Excel) melalui opsi dropdown.
    *   **Tabel Transaksi:** Bagian ini menampilkan daftar detail semua transaksi keuangan coffee shop dengan kolom-kolom berikut:
        *   **NO:** Nomor urut transaksi.
        *   **KETERANGAN:** Deskripsi singkat transaksi (misalnya, "Penjualan Kopi - adik: Caramel Latte (Qty: 1)").
        *   **METODE:** Metode pembayaran atau penerimaan (misalnya, "Tunai", "Qris").
        *   **WAKTU:** Tanggal dan waktu transaksi.
        *   **PEMASUKAN:** Jumlah uang yang masuk.
        *   **PENGELUARAN:** Jumlah uang yang keluar.
        *   **SALDO:** Saldo akhir setelah transaksi tersebut.
        *   **AKSI:** Kolom ini berisi ikon untuk melakukan tindakan pada transaksi:
            *   **Ikon Edit (Pensil):** Untuk mengedit detail transaksi yang sudah ada.
            *   **Ikon Hapus (Tempat Sampah):** Untuk menghapus transaksi dari sistem.
*   **Pencatatan Transaksi:** Menambah, mengedit, atau menghapus catatan transaksi keuangan secara manual. Setiap transaksi dapat dikategorikan dan diberi deskripsi.
*   **Laporan Keuangan:** Mengakses laporan keuangan terperinci, termasuk laporan laba rugi, arus kas, dan ringkasan transaksi. Laporan ini seringkali dilengkapi dengan grafik visual untuk memudahkan analisis.

### 2.5 Manajemen Bisnis (Kost dan Coffee Shop)

Super Admin dapat mengelola detail operasional spesifik untuk masing-masing bisnis.
*   **Manajemen Kost:** Modul ini memungkinkan Super Admin untuk mengelola semua aspek terkait kamar kos. (Lihat Gambar: Manajemen Kamar Kost)
    *   **Navigasi:** Terdapat tombol panah kembali untuk navigasi ke halaman sebelumnya.
    *   **Tombol Tambah Kamar:** Klik tombol "+ Tambah Kamar" untuk menambahkan data kamar kos baru ke sistem.
    *   **Daftar Kamar Kos:** Halaman ini menampilkan daftar kamar kos dalam bentuk kartu, di mana setiap kartu mewakili satu kamar dengan detail sebagai berikut:
        *   **Nomor Kamar:** Identifikasi unik untuk setiap kamar (misalnya, "A9-3").
        *   **Harga Sewa:** Biaya sewa per bulan (misalnya, "Rp 1.600.000 / bulan").
        *   **Fasilitas:** Daftar fasilitas yang tersedia di kamar tersebut (misalnya, "Ac, Kamar Mandi Dalam, Meja Belajar, Kasur, Lemari").
        *   **Detail Penghuni (jika terisi):**
            *   **Penghuni:** Nama penghuni kamar.
            *   **No. HP:** Nomor telepon penghuni.
            *   **Pekerjaan:** Pekerjaan penghuni.
            *   **Status Bayar:** Status pembayaran sewa (misalnya, "Lunas", "Belum Lunas").
        *   **Ketersediaan:** Status ketersediaan kamar ("Tersedia" atau "Tidak Tersedia").
        *   **Tombol Aksi:**
            *   **Edit:** Tombol untuk mengedit detail informasi kamar atau penghuni.
            *   **Hapus:** Tombol untuk menghapus data kamar dari sistem.
    *   **Histori Pembayaran (Pop-up/Modal):** Ketika ikon informasi (i) pada kartu kamar diklik, sebuah pop-up akan muncul menampilkan histori pembayaran untuk kamar tersebut. (Lihat Gambar: Histori Pembayaran Kamar Kos)
        *   **Tombol Tambah Pembayaran Baru:** Untuk mencatat pembayaran sewa baru untuk kamar tersebut.
        *   **Tabel Histori Pembayaran:** Menampilkan detail pembayaran dengan kolom-kolom berikut:
            *   **#:** Nomor urut pembayaran.
            *   **Bulan Tagihan:** Bulan tagihan sewa (misalnya, "2025-11").
            *   **Tgl Bayar Lunas:** Tanggal pembayaran lunas.
            *   **Jumlah:** Jumlah pembayaran.
            *   **Status:** Status pembayaran ("Lunas" atau "Belum Bayar").
            *   **Metode:** Metode pembayaran (misalnya, "Transfer", "Tunai", "Qris").
            *   **Catatan:** Catatan tambahan terkait pembayaran.
            *   **Bukti Bayar:** Tombol "Lihat" untuk melihat bukti pembayaran (misalnya, gambar transfer).
        *   **Tombol Tutup:** Untuk menutup pop-up histori pembayaran.
*   **Manajemen Coffee Shop:** Modul ini memungkinkan Super Admin untuk mengelola daftar menu yang tersedia di coffee shop. (Lihat Gambar: Manajemen Menu Coffee Shop)
    *   **Judul Halaman dan Ikon Keranjang Belanja:** Di bagian atas, Anda akan melihat judul "Manajemen Menu Coffee Shop" dan ikon keranjang belanja. Ikon keranjang belanja ini kemungkinan berfungsi untuk melihat ringkasan pesanan yang sedang dibuat atau riwayat transaksi penjualan.
    *   **Tombol "+ Tambah Menu Baru":** Klik tombol ini untuk menambahkan item menu baru ke daftar. Saat diklik, biasanya akan muncul formulir yang meminta Anda untuk memasukkan detail seperti:
        *   Nama Menu
        *   Harga
        *   Kategori (misalnya, Coffee, Non-Coffee, Makanan, dll.)
        *   Deskripsi (opsional)
        *   Gambar Menu (opsional)
    *   **Kategori Menu:** Menu diorganisir berdasarkan kategori (misalnya, "Coffee"). Anda dapat melihat item-item menu di bawah setiap kategori.
    *   **Kartu Item Menu:** Setiap item menu ditampilkan dalam bentuk kartu dengan detail dan opsi aksi:
        *   **Ikon Edit (Pensil):** Terletak di pojok kiri atas kartu. Klik ikon ini untuk mengedit detail item menu yang sudah ada (misalnya, mengubah nama, harga, atau kategori).
        *   **Ikon Informasi (i):** Terletak di pojok kanan atas kartu. Klik ikon ini untuk melihat informasi lebih lanjut tentang item menu, seperti deskripsi lengkap atau bahan-bahan.
        *   **Nama Menu dan Harga:** Menampilkan nama item menu (misalnya, "Americanoo") dan harganya (misalnya, "Rp 13.000").
        *   **Tombol "Tambah":** Tombol ini berfungsi untuk menambahkan item menu ke daftar pesanan atau keranjang belanja sementara, yang kemudian dapat diproses menjadi transaksi penjualan.
        *   **Tombol "Hapus":** Tombol ini berfungsi untuk menghapus item menu dari daftar. Saat diklik, sistem biasanya akan meminta konfirmasi untuk mencegah penghapusan yang tidak disengaja.

## Bab 3: Peran Admin

Setelah berhasil login, pengguna dengan peran Admin akan memiliki akses terbatas pada fitur-fitur tertentu yang relevan dengan operasional harian. Peran ini dirancang untuk staf operasional yang mengelola tugas-tugas spesifik tanpa akses ke konfigurasi sistem atau manajemen pengguna tingkat tinggi. Hak akses Admin biasanya disesuaikan dengan jenis bisnis yang menjadi tanggung jawabnya (Kost atau Coffee Shop).

### 3.1 Dashboard Admin

Dashboard Admin adalah halaman utama yang dilihat oleh pengguna dengan peran Admin setelah login. Halaman ini menyediakan ringkasan informasi yang relevan dengan operasional harian Admin, terutama yang berkaitan dengan bisnis coffee shop.

**Elemen-elemen pada Dashboard:**

*   **Pesan Selamat Datang dan Informasi Peran:** Di bagian atas, Anda akan melihat pesan "Selamat Datang, admin!" dan informasi peran Anda ("Role: admin"). Ini mengkonfirmasi bahwa Anda telah berhasil login dengan akun Admin.
*   **Tanggal dan Waktu:** Menampilkan tanggal dan waktu saat ini.
*   **Ringkasan Statistik:** Bagian ini menyajikan kartu-kartu ringkasan yang menampilkan data kunci operasional, serupa dengan Super Admin, namun fokus pada data yang relevan dengan operasional Admin:
    *   **Total Pengguna:** Jumlah total akun pengguna yang terdaftar dalam sistem.
    *   **Pendapatan:** Total pendapatan yang tercatat dalam periode waktu yang dipilih.
    *   **Pengeluaran:** Total pengeluaran yang tercatat dalam periode waktu yang dipilih.
    *   **Kamar Tersedia:** Jumlah kamar kos yang saat ini tersedia.
    *   **Item Menu Coffee Shop:** Jumlah total item menu yang terdaftar di coffee shop.
    *   **Selisih:** Perbedaan antara pendapatan dan pengeluaran dalam periode waktu yang dipilih.
*   **Filter Periode Waktu:** Terdapat opsi untuk memfilter data statistik berdasarkan periode waktu tertentu (misalnya, "Hari Ini").

**Navigasi Sidebar Kiri:**

Sidebar navigasi di sisi kiri layar untuk Admin memiliki opsi yang lebih terbatas dibandingkan Super Admin, fokus pada tugas-tugas operasional:

*   **Dashboard:** Kembali ke halaman ringkasan dashboard utama.
*   **Coffee Shop Menu:** Modul khusus untuk mengelola daftar menu coffee shop.
*   **Tentang Kami:** Halaman yang mungkin berisi informasi tentang sistem atau pengembang.

### 3.2 Manajemen Inventaris

Admin dapat mengelola inventaris sesuai dengan jenis bisnis yang menjadi tanggung jawabnya. Admin dapat melihat daftar inventaris, memperbarui jumlah stok, dan mencatat pergerakan barang. Namun, Admin mungkin tidak memiliki hak untuk menghapus jenis item inventaris atau mengubah kategori utama.
*   **Inventaris Kost:** Jika Admin bertanggung jawab atas kost, ia dapat mengelola inventaris kost (misalnya, mencatat penggunaan atau penambahan barang).
*   **Inventaris Coffee Shop:** Jika Admin bertanggung jawab atas coffee shop, ia dapat mengelola inventaris coffee shop (misalnya, memperbarui stok bahan baku setelah pembelian atau penggunaan).
*   **Penambahan/Pengurangan Stok:** Melakukan update stok inventaris yang menjadi tanggung jawabnya.

### 3.3 Manajemen Keuangan

Admin dapat memantau dan mencatat transaksi keuangan yang relevan dengan jenis bisnis yang menjadi tanggung jawabnya. Admin dapat memasukkan data pemasukan dan pengeluaran, tetapi mungkin tidak memiliki akses ke laporan keuangan komprehensif atau kemampuan untuk mengubah data keuangan yang sudah diverifikasi oleh Super Admin.
*   **Keuangan Kost:** Jika Admin bertanggung jawab atas kost, ia dapat memantau pemasukan (misalnya, konfirmasi pembayaran sewa) dan mencatat pengeluaran operasional kost.
*   **Keuangan Coffee Shop:** Jika Admin bertanggung jawab atas coffee shop, ia dapat memantau pemasukan (misalnya, mencatat penjualan harian) dan mencatat pengeluaran coffee shop.
*   **Pencatatan Transaksi:** Menambah atau mengedit catatan transaksi keuangan yang relevan dengan operasional harian.

### 3.4 Manajemen Bisnis (Coffee Shop)

Admin dapat mengelola detail operasional bisnis coffee shop yang menjadi tanggung jawabnya.
*   **Manajemen Coffee Shop:** Modul ini memungkinkan Admin untuk melihat daftar menu yang tersedia di coffee shop dan melakukan transaksi penjualan. (Lihat Gambar: Manajemen Menu Coffee Shop - Admin View)
    *   **Judul Halaman dan Ikon Keranjang Belanja:** Di bagian atas, Anda akan melihat judul "Manajemen Menu Coffee Shop" dan ikon keranjang belanja. Ikon keranjang belanja ini kemungkinan berfungsi untuk melihat ringkasan pesanan yang sedang dibuat atau riwayat transaksi penjualan.
    *   **Kategori Menu:** Menu diorganisir berdasarkan kategori (misalnya, "Coffee"). Anda dapat melihat item-item menu di bawah setiap kategori.
    *   **Kartu Item Menu:** Setiap item menu ditampilkan dalam bentuk kartu dengan detail dan opsi aksi:
        *   **Ikon Informasi (i):** Terletak di pojok kanan atas kartu. Klik ikon ini untuk melihat informasi lebih lanjut tentang item menu, seperti deskripsi lengkap atau bahan-bahan.
        *   **Nama Menu dan Harga:** Menampilkan nama item menu (misalnya, "Americanoo") dan harganya (misalnya, "Rp 13.000").
        *   **Tombol "Tambah":** Tombol ini berfungsi untuk menambahkan item menu ke daftar pesanan atau keranjang belanja sementara, yang kemudian dapat diproses menjadi transaksi penjualan. **Perlu diperhatikan bahwa Admin tidak memiliki akses untuk menambah, mengedit, atau menghapus item menu baru dari daftar.** Fungsi ini hanya tersedia untuk Super Admin.

## Lampiran: Troubleshooting dan FAQ

### Q: Saya lupa password, bagaimana cara meresetnya?
A: Saat ini, fitur reset password mandiri mungkin belum tersedia. Silakan hubungi Super Admin sistem Anda untuk membantu mereset password akun Anda.

### Q: Data yang saya masukkan tidak tersimpan. Apa yang harus saya lakukan?
A: Pastikan Anda memiliki koneksi internet yang stabil. Coba refresh halaman dan ulangi proses. Jika masalah berlanjut, hubungi administrator sistem.

### Q: Saya tidak bisa mengakses beberapa fitur yang seharusnya bisa saya akses.
A: Periksa kembali peran akun Anda. Mungkin Anda login sebagai Admin, padahal fitur tersebut hanya tersedia untuk Super Admin. Jika Anda yakin seharusnya memiliki akses, hubungi Super Admin untuk verifikasi peran akun Anda.

### Q: Aplikasi terasa lambat atau tidak responsif.
A: Coba bersihkan cache browser Anda atau gunakan browser lain. Pastikan juga spesifikasi hardware Anda memenuhi persyaratan sistem. Jika masalah berlanjut, mungkin ada masalah dengan server backend; hubungi administrator teknis.

### Q: Bagaimana cara melihat laporan keuangan atau inventaris?
A: Laporan keuangan dan inventaris dapat diakses melalui modul "Manajemen Keuangan" dan "Manajemen Inventaris" di dashboard Anda. Pastikan Anda memiliki peran yang sesuai (Super Admin memiliki akses penuh ke semua laporan).
