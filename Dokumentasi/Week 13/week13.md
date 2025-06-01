# 🚀 Laporan Progres Mingguan - **SmartBizAdmin**

## 👥 Kelompok: 5
- **Muhammad Fikri Haikal Ariadma / 10231063**  
- **Irfan Zaki Riyanto / 10231045** 
- **Micka Mayulia Utama / 10231053**  
- **Ika Agustin Wulandari / 10231041**  
  
## 🤝 Mitra: Kost Al-Fitri D’Carjoe  
## 📅 Pekan ke-: 13  
## 🗓️ Tanggal:  09/05/2025

---

## ✨ Progress Summary  
Pada pekan ke-13, tim SmartBizAdmin telah menyelesaikan implementasi fitur inti keempat yang mencakup sistem kasir untuk coffee shop dan pengelolaan informasi kost, termasuk data kamar, harga, dan ketersediaannya. Tim juga berhasil mengembangkan panel super admin dengan lima menu utama, yaitu fitur keuangan untuk memantau arus kas, fitur kost untuk mengelola data penyewaan kamar, fitur coffee shop untuk mengatur menu dan transaksi, fitur hak akses untuk pengelolaan pengguna dan peran, serta fitur inventaris untuk memantau stok barang. Selain itu, dashboard admin khusus juga telah dibuat untuk operasional coffee shop, sehingga pengelola dapat fokus pada pemesanan, menu, dan transaksi harian. Visualisasi data sederhana ditambahkan dalam bentuk grafik batang yang menampilkan statistik penjualan menu pada coffee shop serta tingkat hunian pada kost.
---

## ✅ Accomplished Tasks  
- 🗂️ Implementasi fitur kost dan fitur coffee shop
- 🧩 Pembuatan dashboard super admin dan admin
- 🗃️ Visualisasi grafik data keuangan 
- 🔌Demo progress ke mitra
---

## ⚠️ Challenges & 💡 Solutions  

- **🔍 Challenge 1**: …  
  **✅ Solution**: …

- **📌 Challenge 2**: …
  **✅ Solution**: …

---

## 📅 Next Week Plan  
- 🗺️ Penyempurnaan seluruh fitur
- 🛠️ Usability testing
- 🐞 Bugfixing
- 🔌Persiapan deployment (jika diperlukan)
- 📽️ Demo progress ke mitra
---

## 👨‍💻 Contributions  

- **🧑‍🎨 Muhammad Fikri Haikal Ariadma / 10231063**  
  →  

- **🧑‍💻 Irfan Zaki Riyanto / 10230145**  
  → 

- **👩‍🎨 Micka Mayulia Utama / 10231053**  
  →  Membuat laporan 

- **👩‍💼 Ika Agustin Wulandari / 10231041**  
  →  Membuat laporan
---

## 🖼️ Screenshots / Demo  

### 📎 **Kode Backend:**  

- **Kode backend kosController.js:**  
  ![Backend kosController.js](./Image/KodeBackendCoffeeShop.png) 
Potongan kode di atas adalah controller Node.js yang menggunakan Express dan PostgreSQL untuk melakukan operasi CRUD pada data kamar kos di tabel rooms. Terdiri dari lima fungsi: mengambil semua kamar, mengambil kamar berdasarkan ID, menambah, memperbarui, dan menghapus kamar. Setiap fungsi menggunakan async/await, validasi input, dan penanganan error dengan try-catch. Semua response diberikan dalam format JSON dan hanya dapat diakses oleh Superadmin.


- **Kode kos.js:**  
  ![Backend kos.js](./Image/KodeBackendCoffeeShop.png) 
 Kode di atas merupakan konfigurasi routing menggunakan Express.js untuk mengatur endpoint API /api/kos yang terhubung ke fungsi-fungsi pada kosController. Setiap route menangani operasi CRUD: GET untuk mengambil semua atau satu kamar kos, POST untuk menambah kamar, PUT untuk memperbarui, dan DELETE untuk menghapus kamar berdasarkan ID. Middleware protect yang biasanya digunakan untuk autentikasi Superadmin sementara dinonaktifkan (dikomentari). Akhirnya, router diekspor agar dapat digunakan di file utama aplikasi.


- **Kode coffeeShopController.js:**  
  ![Backend coffeeShopController.js](./Image/KodeBackendInventaris.png)
File coffeeShopController.js berisi controller untuk manajemen menu dan pemesanan pada aplikasi coffee shop menggunakan Node.js dan PostgreSQL. Fungsi-fungsi utamanya mencakup: mengambil semua menu (getAllMenus), mengambil menu berdasarkan ID (getMenuById), menambahkan menu baru dengan validasi input (createMenu), memperbarui menu secara dinamis berdasarkan input yang dikirim (updateMenu), serta menghapus menu dengan penanganan error seperti foreign key. Selain itu, terdapat fungsi untuk membuat pesanan (createOrder) yang memvalidasi input pengguna, mengecek ketersediaan menu, menghitung total harga, dan menyimpan data pesanan ke database dengan transaksi untuk menjaga konsistensi data.


- **Kode coffeeShop.js:**  
  ![Backend coffeeShop.js](./Image/KodeBackendInventaris.png)
Kode ini mengatur routing fitur coffee shop dengan Express.js, mencakup autentikasi token dan (placeholder) pengecekan peran admin/superadmin. Disediakan endpoint untuk CRUD menu, pemesanan, dan pencetakan struk, dengan logika ditangani oleh coffeeShopController.
  ---

### 📎 **Kode Frontend:**  

- **Front End ManageCoffeeShopMenu.jsx:**  
  ![Front end ManageCoffeeShopMenu.jsx](./Image/KodeCSSKeuangan.png) 
  

- **Front end ManageKos.jsx:**  
  ![Front end ManageKos.jsx](./Image/KodeCSSInventaris.png)


- **Front end PaymentForm.jsx:**  
  ![Front end PaymentForm.jsx](./Image/KodeCSSInventaris.png)

  ---

### 📎 **Tampilan Sistem Smartbiz Admin:**  

- **Menu Manajemen Keuangan:**  
  ![Menu Manajemen Keuangan](./Image/ManajemenKeuangan.png) 
  Gambar diatas adalah tampilan menu manajemen keuangan pada user super admin yang difungsikan untuk melihat data keuangan coffee shop dan kost.

- **Manajemen Keuangan Coffee Shop:**  
  ![Manajemen Keuangan Coffee Shop](./Image/KeuanganCoffeeShop.png) 
  Gambar diatas adalah tampilan data keuangan di coffee shop, dimana super admin bisa menambah transaksi, bisa mencetak data keuangan (csv, pdf dan excel), bisa menghapus dan mengedit data keuangan serta adanya tampilan visualisasi data (diagram batang dan lingkaran) 

- **Manajemen Keuangan Kost:**  
  ![Manajemen Keuangan Kost](./Image/KeuanganKost.jpeg) 
  Gambar diatas adalah tampilan data keuangan di Kost, dimana super admin bisa menambah transaksi, bisa mencetak data keuangan (csv, pdf dan excel), bisa menghapus dan mengedit data keuangan serta adanya tampilan visualisasi data (diagram batang dan lingkaran)

- **Tampilan Dashboard Super Admin:**  
  ![Tampilan Dashboard Super Admin](./Image/ManajemenInventaris1.png)
Tampilan dashboard yang bisa di akses oleh super admin ada 5 fitur. Yang pertama ada menu keuangan, menu kost, menu coffee shop, menu hak akses, menu inventarsi 
  
- **Tampilan Dashboard Admin:**  
  ![Tampilan Dashboard Admin](./Image/ManajemenInventaris2.png)
 Tampilan dashboard yang bisa di akses oleh admin ada 1 fitur, yaitu menu coffee shop
  
- **Menu Manajemen Kost:**  
  ![Menu Manajemen Kost](./Image/ManajemenInventaris.png) 
Tampilan ini berisikan pengelolaan crud kost, dari pengisian  kamar kost fasilitas yang ada.

- **Menu Manajemen Coffee Shop:**  
  ![Menu Manajemen Coffee Shop](./Image/ManajemenInventaris.png) 
Tampilan ini berisikan crud untuk menu pada coffee shop

- **Keranjang Coffee Shop:**  
  ![Keranjang Coffee Shop](./Image/ManajemenInventaris.png) 
Tampilan ini merupakan menu keranjang pesanan sebelum diproses menjadi transaksi, sehingga bisa dibatalkan jika pemesan ingin mengubah menu pesanan.

- **Transaksi Coffee Shop:**  
  ![Transaksi Coffee Shop](./Image/ManajemenInventaris.png) 
Tampilan ini merupakan fiksasi pesanan customer dari pesanan yang dipilih di menu keranjang sebelumnya. Isi dari ini ada nama customer, total tagihan, metode pembayaran.

- **Struk Transaksi Coffee Shop:**  
  ![Struk Transaksi Coffee Shop](./Image/ManajemenInventaris.png) 
Tampilan ini struk dari pemesanan yang telah di order dan juga telah dibayarkan. Berisikan timestamp transakasi dibuat, total tagihan, pembayaran dan juga kop dari nama coffee shop.
---

### 📎 **Demo Progress ke Mitra:**  
![Demo Progress ke Mitra](./Image/DemoMitra2.jpeg)  
- Bukti progres ke mitra 
---

### 📎 **3 test case fungsi:**  

- **Minimun Stok:**  
  - ![Minimun stok](./Image/TCStok.png)
     Tampilan awal saat manajemen invetaris coffee shop belum di input

  - ![Minimum stok](./Image/TCStok5.png)
    Tampilan ketika menginput data inventaris di bawah stok minimum

  - ![Minimum stok](./Image/TCStok3.jpeg)
    Tampilan ketika data inputan stok inventaris berada di bawah nilai minimum stok

- **Grafik Pembayaran:**  
  - ![Grafik pembayaran](./Image/TCGrafik.png)
     Tampilan awal saat manajemen keuangan coffee shop belum di input

  - ![Grafik pembayaran](./Image/TCGrafik2.png)
     Tampilan ketika ingin menginput data pemasukan
  
  - ![Grafik pembayaran](./Image/TCGrafik3.png)
     Tampilan ketika data pemasukan berhasil di inputkan
  
  - ![Grafik pembayaran](./Image/TCGrafik4.png)
     Tampilan ketika ingin menginput data pengeluaran
  
  - ![Grafik pembayaran](./Image/TCGrafik5.png) 
     Tampilan ketika data pemasukan dan pengeluaran berhasil di input, maka grafik batang dan lingkaran akan langsung menampilkan perbandingan antara pemasukan dan pengeluaran

- **Stok Saat Tidak di nilai Minimum:**  
  - ![Stok saat tidak di nilai minimum](./Image/TCStok.png)
    Tampilan awal saat manajemen invetaris coffee shop belum di input 

  - ![Stok saat tidak di nilai minimum](./Image/TCStok2.png)
     Tampilan ketika menginput data inventaris tidak di bawah stok minimum

  - ![Stok saat tidak di nilai minimum](./Image/TCStok4.jpeg)
     Tampilan ketika data inputan stok inventaris tidak di bawah nilai minimum stok
---
