### **\# 🚀 Laporan Progres Mingguan \- \*\*SmartBizAdmin\*\***  

### **\*\*👥 Kelompok\*\*: A5**  

### **\*\*🤝 Mitra\*\*: Kost Al-Fitri D’Carjoe**

### **\*\*📅 Pekan ke-\*\*: 10**  

### **\*\*🗓️ Tanggal\*\*: 18/04/2025**  

### 

### **\---**

### 

### **\#\# ✨ Progress Summary**  

### **Pada pekan ke-10, tim \*\*SmartBizAdmin\*\* telah menyelesaikan perancangan dan implementasi awal backend untuk sistem Smartbiz Admin, termasuk desain dan setup database PostgreSQL serta pembuatan REST API skeleton. Struktur frontend dasar juga telah disiapkan**

### 

### **\---**

### 

### **\#\# ✅ Accomplished Tasks**  

### **\- 🗂️ Merancang skema database Smartbiz Admin**

### **\- 🧩 Mengimplementasikan struktur database di PostgreSQL**

### **\- 🗃️ Menyiapkan struktur folder backend**

### **\- 🔌 Menambahkan koneksi database melalui file db.js**

### **\- 🔁  Membuat REST API skeleton dengan Express.js (endpoint dasar untuk login, register, keuangan, kos, coffee shop, dan inventaris)**

\- **🎨 Menyiapkan struktur frontend dasar dengan React \+ Vite**

### **\---**

### 

### **\#\# ⚠️ Challenges & 💡 Solutions**  

### **\- \*\*🔍 Challenge 1\*\*: Penyesuaian struktur folder dan routing backend**

###   **\- \*\*✅ Solution\*\*:  Menyesuaikan struktur folder agar modular dan sesuai standar Express, serta membuat file index.js yang mengimpor dan menjalankan semua route secara konsisten.**

### 

### **\- \*\*📌 Challenge 2\*\*: Koneksi ke database PostgreSQL**

###   **\- \*\*✅ Solution\*\*: Membuat file db.js yang menggunakan modul pg untuk membuat koneksi pool yang dapat digunakan oleh seluruh route.**

### 

### **\---**

### 

### 

### **\#\# 📅 Next Week Plan**  

### **\- 🗺️ Implementasi sistem autentikasi (login/register)**

### **\- 🛠️ Implementasi fitur inti \#1 (sesuai kebutuhan mitra)**

### **\- 🔌 Integrasi frontend-backend untuk fitur yang sudah ada**

### **\- 📽️ Demo progress ke mitra** 

###   

### **\---**

### 

### **\#\# 👨‍💻 Contributions**  

### **\- \*\*🧑‍🎨 Muhammad Fikri Haikal Ariadma / 10231063\*\***  

###   **→ Membuat struktur folder frontend, merancang skema database, mengimplementasikan struktur database**

### 

### **\- \*\*🧑‍💻 Irfan Zaki Riyanto / 10230145\*\***  

###   **→  Menyusun struktur backend, membuat koneksi database, menambahkan routing dasar, merancang skema database, menyusun laporan md**

### 

### **\- \*\*👩‍🎨 Micka Mayulia Utama / 10231053\*\***  

###   **→ Merancang skema database, menyusun laporan md**	

### 

### **\- \*\*👩‍💼 Ika Agustin Wulandari / 10231041\*\***  

###   **→ Merancang skema database**

### 

### **\---**

### 

### 

### **\#\# 🖼️ Screenshots / Demo**  

### **📎 \*\*Skema Database\*\*:**

### **\!\[\](./image/skemadb.png)**

### **Gambar diatas merupakan skema database dari smartbiz admin, yang dimana ada 10 tabel yang akan dijabarkan sebagai berikut:**

- ### **Tabel user**

  - **Memiliki relasi 1:N pada `tabel cart`, `tabel orders`, `tabel booking`, `tabel transaction`, `tabel inventory transaction`, `tabel order items`**

- ### **Tabel cart**

- ### **Tabel menu items**

  - **Memiliki relasi  1:N pada `tabel order items`**

- ### **Tabel order items**

- **Tabel orders**  
- **Tabel booking**  
- **Tabel rooms**  
  - **Memiliki relasi 1:N pada `tabel booking`**  
- **Tabel transaction**  
- **Tabel inventory transaction**  
- **Tabel inventory**  
  - **Memiliki relasi 1:N pada `tabel inventory transactions`**

### **📎 \*\*Membuat struktur backend \*\*:**

### **\!\[\](./image/strbackend.png)**

**backend/**  
**├── node\_modules/**  
**├── routes/**  
**│   ├── auth.js**  
**│   ├── coffeeeShop.js**  
**│   ├── inventaris.js**  
**│   ├── keuangan.js**  
**│   └── kos.js**  
**├── db.js**  
**├── inde.js**  
**├── package-lock.json**  
**└── package.json**

**Ini merupakan struktur folder dari backend pada sistem \*\*SmartBizAdmin\*\***

### **📎 \*\*Membuat struktur frontend \*\*:**

### **\!\[\](./image/strfrontend.png)**

**Ini merupakan struktur folder dari backend pada sistem \*\*SmartBizAdmin\*\***

### **📎 \*\*Tampilan Frontend \*\*:**

### **\!\[\](./image/frontend-tampilan.png)**

### **Ini merupakan tampilan react+vite pada halaman website, yang berhasil dijalankan untuk sistem \*\*SmartBizAdmin\*\***

### **📎 \*\*Menambahkan koneksi database melalui file db.js\*\*:**

### **\!\[\](./image/db.png)**

**File db.js berfungsi untuk mengatur koneksi backend ke database PostgreSQL menggunakan modul pg. Di dalamnya dibuat objek pool dari class Pool dengan parameter konfigurasi seperti user, host, database, password, dan port. Nilai-nilai ini menyesuaikan dengan informasi login dan nama database lokal yang digunakan, dalam hal ini Smartbiz-Admin. Objek pool tersebut diekspor agar dapat digunakan di file lain dalam folder routes, sehingga setiap endpoint dapat langsung mengakses database tanpa harus membuat koneksi baru berulang kali.**

### **📎 \*\*Mengimplementasikan struktur database\*\*:**

### **\!\[\](./image/dbSA.jpg)**

**Pada tahap implementasi backend, tim juga telah mengintegrasikan struktur database nyata berdasarkan skema relasional yang telah dirancang sebelumnya. Gambar ERD tersebut menunjukkan hubungan antar tabel utama seperti users, transactions, inventory, menu\_items, orders, bookings, hingga rooms yang merepresentasikan fitur-fitur utama dari sistem manajemen kos dan coffee shop. Tabel seperti transactions, inventory\_transactions, dan orders menjadi basis penyimpanan data keuangan, pergerakan barang, dan pemesanan menu, yang seluruhnya akan diakses dan dimanipulasi melalui endpoint REST API seperti yang terdapat pada file keuangan.js. Dengan struktur database ini, API dapat berfungsi dengan optimal dalam mengelola data secara terstruktur dan terintegrasi, memungkinkan sistem SmartBizAdmin untuk memberikan fitur yang lengkap dan efisien kepada admin.**

### **📎 \*\*Membuat REST API skeleton\*\*:**

### **\!\[\](./image/csAPI.png)**

**Difungsikan untuk Client dalam mengirim request ke server lewat endpoint API. kemudian Server memproses permintaan (bisa ambil data dari database, proses logic, dll). Dan terakhir Server mengirim response kembali ke client (biasanya dalam**

### **\!\[\](./image/invAPI.png)**

**API yang digunakan untuk mengelola data inventaris barang pada suatu sistem kost dan juga coffee shop**

### **\!\[\](./image/kosAPI.png)**

**sekumpulan endpoint yang digunakan untuk mengelola data tempat kost dalam aplikasi—baik untuk pemilik kost.**

### **\!\[\](./image/uangAPI.png)** 

**API yang digunakan untuk mengelola data transaksi dan aktivitas keuangan dalam sistem coffee shop**

### **\!\[\](./image/authAPI.png)**

**API yang mengatur proses login, register, dan pengamanan akses pengguna. Ini adalah “gerbang masuk” ke sistem, biar hanya user yang terdaftar dan valid yang bisa akses fitur tertentu.**

