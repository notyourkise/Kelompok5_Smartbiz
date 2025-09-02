# 🧠 SmartBiz Admin
- SmartBiz Admin adalah sistem informasi berbasis web untuk mengelola bisnis kost dan coffee shop. Sistem ini terdiri dari dua komponen utama: Backend (API dan logika aplikasi) dan Frontend (antarmuka pengguna).
---
## 1️⃣ Petunjuk Instalasi
- Disarankan untuk dapat menginstall package yang diperlukan pada sistem smartbiz admin ini
    ```
    npm install @tsparticles/react tsparticles
    ```
    ```
    npm install --save @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
    ```
    ```
    npm install --save @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons
    ```
    ```
    npm install react-chartjs-2 chart.js
    ```
- Backend
    ```
    cd backend
    npm install
    ```

- Frontend
    ```
    npm create vite@latest my-frontend --template react
    cd frontend-app
    npm install 
    ```
---
## 2️⃣ Petunjuk Konfigurasi
- Pastikan Node.js dan npm sudah terpasang.
- Backend menggunakan file index.js sebagai entry point.
- Konfigurasi koneksi (seperti database, host, port) kemungkinan berada dalam folder config di backend.
---
## 3️⃣ Petunjuk Pengoperasian
- Jalankan Backend:
    ```
    cd backend
    node index.js
    ```

- Jalankan Frontend:
    ```
    cd frontend-app
    npm run dev
    ```
- Setelah keduanya berjalan:
    - Backend biasanya diakses di `http://localhost:5000`
    - Frontend biasanya diakses di `http://localhost:5173`
---
## 4️⃣ Berkas Manifest
- Backend (backend/package.json)
    - Menyimpan metadata proyek seperti:
        - name, version, main dan scripts
    - Dependensi seperti express, cors, dll


- Frontend (frontend-app/package.json)
    - Metadata proyek frontend seperti:
        - name, scripts, dependencies
    - Digunakan oleh Vite untuk menjalankan React
---
## 5️⃣ Informasi Hak Cipta dan Perizinan
- Hak Cipta © 2025 - Tim SmartBiz Admin
---
## 6️⃣ Informasi Kontak
- Developer/Distributor:
    - Nama: SmartBiz Admin Team
    - Email: 10231063@student.itk.ac.id
    - No. WA: +62 856-5138-4990
    - Kampus: Sistem Informasi - ITK, Angkatan 2023
---
## 7️⃣ Troubleshooting
|Masalah Umum|Solusi|
|---|---|
|`npm install` gagal|Pastikan `node.js` terbaru terpasang|
|`API` tidak merespon|Cek apakah backend sudah berjalan|
|Data tidak muncul di frontend|Pastikan koneksi antara frontend-backend benar|
|`Error CORS`|Tambahkan `middleware CORS` di backend|
|`Error Vite Port`|Jalankan forntend di poprt berbeda: `npm run dev -- --posrt=3000`|    
---
## 8️⃣ Changelog
v1.0 – Mei 2025
- Setup backend Node.js Express ✅
- Setup frontend React + Vite ✅
- Modul Login & Register ✅
- Modul Manajemen Kost ✅
- Modul Manajemen Menu Coffee Shop ✅
- Integrasi API sederhana ✅
---
## 9️⃣ Bagian Berita
- 🗓️ 24 Mei 2025
    - Versi 1.0 SmartBiz Admin resmi dirilis dan digunakan oleh mitra pertama untuk uji coba sistem digitalisasi pengelolaan kost dan coffee shop.


