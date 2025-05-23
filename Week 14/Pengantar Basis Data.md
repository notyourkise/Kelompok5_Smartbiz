# 📚 Dokumentasi Struktur Tabel Sistem Akademik

**Nama:** **Ajeng Masayu Anjani Putri**  
**NIM:** **16231003**

---

## Soal 1: Dokumentasikan Perintah DDL (Data Definition Language)

**Berikut adalah dokumentasi visual untuk perintah DDL pembuatan database dan tabel-tabel utama pada sistem akademik.**

---

### 1. Membuat Database

![Query Membuat Database](img/database.jpg)

**Deskripsi:**  
Gambar ini menunjukkan query atau langkah awal untuk membuat database yang akan digunakan sebagai basis data sistem akademik. Proses ini merupakan fondasi sebelum pembuatan tabel-tabel lain.

---

### 2. Tabel Mahasiswa

![Struktur Tabel Mahasiswa](img/tabel_mahasiswa.jpg)

**Deskripsi:**  
Tabel Mahasiswa menyimpan data mahasiswa, terdiri dari kolom **NIM** sebagai primary key, **nama**, **alamat**, **id_jurusan** (relasi ke tabel Jurusan), dan **tanggal lahir**.

---

### 3. Tabel Jurusan

![Struktur Tabel Jurusan](img/tabel_jurusan.jpg)

**Deskripsi:**  
Tabel Jurusan berisi daftar jurusan yang tersedia di kampus, dengan **id_jurusan** sebagai primary key dan **nama_jurusan**.

---

### 4. Tabel Dosen

![Struktur Tabel Dosen](img/tabeL_dosen.jpg)

**Deskripsi:**  
Tabel Dosen menyimpan informasi dosen, terdiri dari **id_dosen** (primary key), **nama_dosen**, dan **alamat**.

---

### 5. Tabel Matakuliah

![Struktur Tabel Matakuliah](img/tabel_matkul.jpg)

**Deskripsi:**  
Tabel Matakuliah berisi daftar mata kuliah, dengan **id_matkul** sebagai primary key, **nama_matkul**, dan **jumlah SKS**.

---

### 6. Tabel Mengajar

![Struktur Tabel Mengajar](img/tabel_mengajar.jpg)

**Deskripsi:**  
Tabel Mengajar menghubungkan dosen dengan mata kuliah yang diajarkan pada tahun ajaran tertentu. Terdapat relasi ke tabel **Dosen** dan **Matakuliah**.

---

### 7. Tabel KRS

![Struktur Tabel KRS](img/tabel_krs.jpg)

**Deskripsi:**  
Tabel KRS (**Kartu Rencana Studi**) menyimpan data pengambilan mata kuliah oleh mahasiswa pada semester tertentu, termasuk nilai yang diperoleh. Terdapat relasi ke tabel **Mahasiswa** dan **Mengajar**.

---

## Soal 2: Dokumentasikan Perintah DML (Data Manipulation Language)

Berikut adalah dokumentasi visual untuk perintah DML (**INSERT**) pada tabel-tabel utama sistem akademik. Setiap gambar diambil dari folder `img` pada direktori `Week 14` dan disertai deskripsi detail sesuai data yang didokumentasikan.

---

### a. INSERT Tabel Mahasiswa

![Data Mahasiswa Setelah INSERT](img/data_mahasiswa.jpg)

**Deskripsi:**  
Gambar ini menampilkan hasil setelah melakukan perintah **INSERT** pada tabel Mahasiswa. Pada gambar terlihat beberapa baris data mahasiswa yang telah berhasil dimasukkan ke dalam tabel, lengkap dengan kolom **NIM**, **nama**, **alamat**, **id_jurusan**, dan **tanggal lahir**. Proses insert ini memastikan bahwa setiap mahasiswa yang baru didaftarkan langsung tercatat di sistem, sehingga data mahasiswa dapat dikelola dan diakses dengan mudah untuk keperluan administrasi akademik, pengisian KRS, dan pelaporan.

---

### b. INSERT Tabel Jurusan

![Data Jurusan Setelah INSERT](img/data_jurusan.jpg)

**Deskripsi:**  
Gambar ini memperlihatkan hasil penambahan data jurusan ke dalam tabel Jurusan. Setiap baris pada tabel menunjukkan **id_jurusan** dan **nama_jurusan** yang telah diinput. Proses insert ini sangat penting untuk memastikan seluruh jurusan yang tersedia di kampus sudah tercatat dengan benar, sehingga mahasiswa dapat memilih jurusan sesuai minat dan sistem dapat mengelompokkan mahasiswa berdasarkan jurusan yang diambil.

---

### c. INSERT Tabel Dosen

![Data Dosen Setelah INSERT](img/data_dosen.jpg)

**Deskripsi:**  
Gambar ini menunjukkan hasil setelah melakukan perintah **INSERT** pada tabel Dosen. Data yang berhasil dimasukkan meliputi **id_dosen**, **nama_dosen**, dan **alamat**. Setiap dosen yang baru diinput akan langsung tercatat di sistem, sehingga memudahkan dalam penjadwalan mengajar, distribusi mata kuliah, serta pelacakan riwayat mengajar dosen di lingkungan akademik.

---

### d. INSERT Tabel Matakuliah

![Data Matakuliah Setelah INSERT](img/data_matkul.jpg)

**Deskripsi:**  
Gambar ini menampilkan hasil proses **INSERT** data pada tabel Matakuliah. Setiap baris pada tabel berisi **id_matkul**, **nama_matkul**, dan **jumlah SKS**. Dengan adanya data ini, sistem dapat menampilkan daftar mata kuliah yang tersedia, mengatur beban studi mahasiswa, serta memudahkan proses pengisian KRS dan perencanaan kurikulum.

---

### e. INSERT Tabel Mengajar

![Data Mengajar Setelah INSERT](img/data_mengajar.jpg)

**Deskripsi:**  
Gambar ini memperlihatkan hasil penambahan data pada tabel Mengajar. Tabel ini berisi informasi mengenai dosen yang mengajar mata kuliah tertentu pada tahun ajaran tertentu. Setiap baris menghubungkan **id_dosen**, **id_matkul**, dan **tahun_ajaran**, sehingga sistem dapat mencatat siapa saja dosen pengampu setiap mata kuliah dan pada periode kapan mereka mengajar. Data ini sangat penting untuk penjadwalan, evaluasi kinerja dosen, dan pelaporan akademik.

---

### f. INSERT Tabel KRS

![Data KRS Setelah INSERT](img/data_krs.jpg)

**Deskripsi:**  
Gambar ini menampilkan hasil proses **INSERT** data pada tabel KRS (**Kartu Rencana Studi**). Setiap baris pada tabel menunjukkan data pengambilan mata kuliah oleh mahasiswa pada semester tertentu, lengkap dengan nilai yang diperoleh. Data ini sangat penting untuk memantau riwayat studi mahasiswa, proses evaluasi akademik, serta menjadi dasar dalam pembuatan transkrip nilai dan kelulusan mahasiswa.

---

## Soal 3: Dokumentasikan Perintah Query Join

Berikut adalah dokumentasi visual untuk perintah **Query Join** pada sistem akademik. Setiap bagian terdiri dari screenshot query SQL yang dijalankan dan hasil output query tersebut, lengkap dengan deskripsi detail untuk memudahkan pemahaman.

---

### 1. Menggabungkan Data Mahasiswa dengan Jurusan

**Query SQL:**

![Query Join Mahasiswa dan Jurusan](img/query_1.jpg)

**Deskripsi:**  
Gambar di atas merupakan query SQL untuk menampilkan data mahasiswa beserta informasi jurusannya. Query ini menggunakan **JOIN** antara tabel Mahasiswa dan Jurusan berdasarkan **id_jurusan**. Kolom yang ditampilkan meliputi **NIM Mahasiswa**, **Nama Mahasiswa**, **Kode Jurusan**, dan **Nama Jurusan**.

**Hasil Output:**

![Hasil Query Join Mahasiswa dan Jurusan](img/hasil_1.jpg)

**Deskripsi Hasil:**  
Gambar ini menunjukkan hasil dari query join Mahasiswa dan Jurusan. Setiap baris menampilkan data mahasiswa lengkap dengan jurusan yang diambil, sehingga memudahkan dalam melihat relasi antara mahasiswa dan jurusan di sistem akademik.

---

### 2. Menggabungkan Data Dosen dengan Mata Kuliah

**Query SQL:**

![Query Join Dosen dan Mata Kuliah](img/query_2.jpg)

**Deskripsi:**  
Gambar ini merupakan query SQL untuk menampilkan data dosen beserta mata kuliah yang diajar. Query menggunakan **JOIN** antara tabel Dosen, Mengajar, dan Matakuliah. Kolom yang ditampilkan meliputi **NIP Dosen**, **Nama Dosen**, **Kode Mata Kuliah**, dan **Nama Mata Kuliah**.

**Hasil Output:**

![Hasil Query Join Dosen dan Mata Kuliah](img/hasil_2.jpg)

**Deskripsi Hasil:**  
Gambar ini memperlihatkan hasil join antara Dosen dan Mata Kuliah yang diajar. Setiap baris menampilkan dosen beserta mata kuliah yang diampu, sehingga dapat diketahui distribusi pengajaran di lingkungan akademik.

---

### 3. Menampilkan Semua Dosen Beserta Mata Kuliah yang Diajar (Termasuk yang Belum Mengajar)

**Query SQL:**

![Query Join Semua Dosen dan Mata Kuliah](img/query_3.jpg)

**Deskripsi:**  
Gambar ini merupakan query SQL untuk menampilkan semua dosen, termasuk yang belum mengajar mata kuliah. Query menggunakan **LEFT JOIN** antara tabel Dosen, Mengajar, dan Matakuliah. Kolom yang ditampilkan meliputi **NIP Dosen**, **Nama Dosen**, **Kode Mata Kuliah** (jika ada), dan **Nama Mata Kuliah** (jika ada).

**Hasil Output:**

![Hasil Query Join Semua Dosen dan Mata Kuliah](img/hasil_3.jpg)

**Deskripsi Hasil:**  
Gambar ini menampilkan seluruh dosen beserta mata kuliah yang diajar, termasuk dosen yang belum memiliki mata kuliah. Jika dosen belum mengajar, kolom mata kuliah akan kosong. Hal ini penting untuk monitoring beban mengajar dosen.

---

### 4. Menampilkan Data Mengajar Lengkap dengan Informasi Dosen, Mata Kuliah, dan Mahasiswa

**Query SQL:**

![Query Join Data Mengajar Lengkap](img/query_4.jpg)

**Deskripsi:**  
Gambar ini merupakan query SQL untuk menampilkan data mengajar lengkap dengan informasi dosen, mata kuliah, dan mahasiswa. Query menggunakan **JOIN** antara tabel Mengajar, Dosen, Matakuliah, KRS, dan Mahasiswa. Kolom yang ditampilkan meliputi **NIP Dosen**, **Nama Dosen**, **Kode Mata Kuliah**, **Nama Mata Kuliah**, **NIM Mahasiswa**, dan **Nama Mahasiswa**.

**Hasil Output:**

![Hasil Query Join Data Mengajar Lengkap](img/hasil_4.jpg)

**Deskripsi Hasil:**  
Gambar ini memperlihatkan hasil query join yang menampilkan data lengkap aktivitas mengajar, mulai dari dosen, mata kuliah yang diajar, hingga mahasiswa yang mengambil mata kuliah tersebut. Data ini sangat bermanfaat untuk analisis aktivitas akademik dan pelaporan.

---
