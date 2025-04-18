# 🚀 Laporan Progres Mingguan - **SmartBizAdmin**

## 👥 Kelompok: A5  
## 🤝 Mitra: Kost Al-Fitri D’Carjoe  
## 📅 Pekan ke-: 10  
## 🗓️ Tanggal: 18/04/2025  

---

## ✨ Progress Summary  
Pada pekan ke-10, tim **SmartBizAdmin** telah menyelesaikan perancangan dan implementasi awal backend untuk sistem Smartbiz Admin, termasuk desain dan setup database PostgreSQL serta pembuatan REST API skeleton. Struktur frontend dasar juga telah disiapkan.

---

## ✅ Accomplished Tasks  
- 🗂️ Merancang skema database Smartbiz Admin  
- 🧩 Mengimplementasikan struktur database di PostgreSQL  
- 🗃️ Menyiapkan struktur folder backend  
- 🔌 Menambahkan koneksi database melalui file `db.js`  
- 🔁 Membuat REST API skeleton dengan Express.js (endpoint dasar untuk login, register, keuangan, kos, coffee shop, dan inventaris)  
- 🎨 Menyiapkan struktur frontend dasar dengan React + Vite  

---

## ⚠️ Challenges & 💡 Solutions  

- **🔍 Challenge 1**: Penyesuaian struktur folder dan routing backend  
  **✅ Solution**: Menyesuaikan struktur folder agar modular dan sesuai standar Express, serta membuat `index.js` yang mengimpor dan menjalankan semua route secara konsisten.

- **📌 Challenge 2**: Koneksi ke database PostgreSQL  
  **✅ Solution**: Membuat file `db.js` yang menggunakan modul `pg` untuk membuat koneksi pool yang dapat digunakan oleh seluruh route.

---

## 📅 Next Week Plan  
- 🗺️ Implementasi sistem autentikasi (login/register)  
- 🛠️ Implementasi fitur inti #1 (sesuai kebutuhan mitra)  
- 🔌 Integrasi frontend-backend untuk fitur yang sudah ada  
- 📽️ Demo progress ke mitra  

---

## 👨‍💻 Contributions  

- **🧑‍🎨 Muhammad Fikri Haikal Ariadma / 10231063**  
  → Membuat struktur folder frontend, merancang skema database, mengimplementasikan struktur database  

- **🧑‍💻 Irfan Zaki Riyanto / 10230145**  
  → Menyusun struktur backend, membuat koneksi database, menambahkan routing dasar, merancang skema database, menyusun laporan md  

- **👩‍🎨 Micka Mayulia Utama / 10231053**  
  → Merancang skema database, menyusun laporan md  

- **👩‍💼 Ika Agustin Wulandari / 10231041**  
  → Merancang skema database  

---

## 🖼️ Screenshots / Demo  

### 📎 **Skema Database:**  
![Skema Database](./Image/skemadb.png)  
Gambar di atas menunjukkan skema database **SmartBizAdmin**, yang terdiri dari 10 tabel utama:

- **Tabel user**  
  - Memiliki relasi 1:N ke `cart`, `orders`, `booking`, `transaction`, `inventory transaction`, dan `order items`
- **Tabel cart**
- **Tabel menu_items**  
  - Memiliki relasi 1:N ke `order items`
- **Tabel order items**
- **Tabel orders**
- **Tabel booking**
- **Tabel rooms**  
  - Memiliki relasi 1:N ke `booking`
- **Tabel transaction**
- **Tabel inventory**
- **Tabel inventory transaction**

---

### 📎 **Struktur Backend:**  
![Struktur Backend](./image/strbackend.png)  


---

### 📎 **Struktur Frontend:**  
![Struktur Frontend](./image/strfrontend.png)  
Struktur frontend dasar menggunakan React + Vite.

---

### 📎 **Tampilan Frontend:**  
![Tampilan Frontend](./image/frontend-tampilan.png)  
Halaman awal dari sistem **SmartBizAdmin** yang berhasil dirender menggunakan React + Vite.

---

### 📎 **Koneksi Database (`db.js`):**  
![Koneksi DB](./image/db.png)  
`db.js` digunakan untuk mengatur koneksi backend ke PostgreSQL menggunakan modul `pg` dengan `pool` yang bisa digunakan oleh semua route.

---

### 📎 **Implementasi Struktur Database (ERD):**  
![ERD](./image/dbSA.jpg)  
Gambar ini menunjukkan hubungan antar tabel utama seperti `users`, `transactions`, `inventory`, `menu_items`, `orders`, `bookings`, hingga `rooms`.

---

### 📎 **REST API Skeleton:**  

- **Endpoint Coffee Shop:**  
  ![API CoffeeShop](./image/csAPI.png) 
  Difungsikan untuk Client dalam mengirim request ke server lewat endpoint API. kemudian Server memproses permintaan (bisa ambil data dari database, proses logic, dll). Dan terakhir Server mengirim response kembali ke client

- **Endpoint Inventaris:**  
  ![API Inventaris](./image/invAPI.png)
  API yang digunakan untuk mengelola data inventaris barang pada suatu sistem kost dan juga coffee shop  

- **Endpoint Kos:**  
  ![API Kos](./image/kosAPI.png)
  Sekumpulan endpoint yang digunakan untuk mengelola data tempat kost dalam aplikasi—baik untuk pemilik kost.  

- **Endpoint Keuangan:**  
  ![API Keuangan](./image/uangAPI.png)
  API yang digunakan untuk mengelola data transaksi dan aktivitas keuangan dalam sistem coffee shop
  

- **Endpoint Autentikasi:**  
  ![API Auth](./image/authAPI.png)
  API yang mengatur proses login, register, dan pengamanan akses pengguna. Ini adalah “gerbang masuk” ke sistem, biar hanya user yang terdaftar dan valid yang bisa akses fitur tertentu.
  

---



