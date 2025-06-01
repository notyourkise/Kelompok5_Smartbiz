# Dokumentasi API SmartBiz

Dokumen ini berisikan gambaran umum tentang endpoint API RESTful untuk sistem SmartBiz Admin.

## URL Dasar

Semua endpoint API diawali dengan `/api`. Sebagai contoh, endpoint `/auth/register` dapat diakses di `http://url-backend/api/auth/register`.

## Autentikasi

Semua rute yang memerlukan autentikasi membutuhkan JSON Web Token (JWT) yang dikirim dalam header `Authorization` sebagai token Bearer.

Contoh: `Authorization: Bearer TOKEN_JWT_PENGGUNA`

### 1. Autentikasi Pengguna

Menangani register dan login pengguna.

#### `POST /api/auth/register`

*   **Deskripsi**: Mendaftarkan pengguna baru dengan peran 'admin' atau 'superadmin'.
*   **Autentikasi**: Tidak ada (endpoint publik)
*   **Body Permintaan**:
    ```json
    {
      "username": "string",
      "password": "string",
      "role": "string" // "admin" atau "superadmin"
    }
    ```
*   **Respons**:
    *   `201 Created`:
        ```
        User [username] berhasil didaftarkan
        ```
    *   `400 Bad Request`:
        ```
        Username, password, dan role harus diisi
        ```
        atau
        ```
        Role tidak valid. Hanya admin atau superadmin yang diperbolehkan.
        ```
    *   `409 Conflict`:
        ```
        Username sudah digunakan
        ```
    *   `500 Internal Server Error`:
        ```
        Terjadi kesalahan pada server saat mendaftarkan user
        ```

#### `POST /api/auth/login`

*   **Deskripsi**: Melakukan login pengguna yang sudah ada dan mengembalikan token JWT.
*   **Autentikasi**: Tidak ada (endpoint publik)
*   **Body Permintaan**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Login berhasil",
          "token": "TOKEN_JWT_PENGGUNA",
          "role": "peran_pengguna" // contoh: "admin", "superadmin"
        }
        ```
    *   `400 Bad Request`:
        ```
        Username dan password harus diisi
        ```
    *   `401 Unauthorized`:
        ```
        Password salah
        ```
        atau
        ```
        Username atau password salah
        ```
    *   `500 Internal Server Error`:
        ```
        Terjadi kesalahan pada server saat login
        ```

### 2. Manajemen Pengguna

Mengelola akun pengguna (memerlukan autentikasi dan peran tertentu untuk beberapa operasi).

#### `GET /api/users`

*   **Deskripsi**: Mengambil daftar semua pengguna.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Respons**:
    *   `200 OK`:
        ```json
        [
          {
            "id": 1,
            "username": "adminuser",
            "role": "admin"
          },
          {
            "id": 2,
            "username": "superadminuser",
            "role": "superadmin"
          }
        ]
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal mengambil data pengguna"
        }
        ```

#### `POST /api/users`

*   **Deskripsi**: Membuat pengguna baru. Endpoint ini ditujukan untuk Superadmin dalam membuat pengguna, berbeda dengan pendaftaran publik.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Body Permintaan**:
    ```json
    {
      "username": "string",
      "password": "string",
      "role": "string" // "admin" atau "superadmin"
    }
    ```
*   **Respons**:
    *   `201 Created`:
        ```json
        {
          "message": "User created successfully"
        }
        ```
    *   `403 Forbidden`:
        ```json
        {
          "error": "Akses ditolak. Hanya superadmin yang bisa mengakses ini."
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Failed to create user"
        }
        ```

#### `PUT /api/users/:id`

*   **Deskripsi**: Memperbarui username atau peran pengguna yang sudah ada berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Pengguna
*   **Body Permintaan**:
    ```json
    {
      "username": "string",
      "role": "string" // "admin" atau "superadmin"
    }
    ```
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Pengguna berhasil diperbarui"
        }
        ```
    *   `403 Forbidden`:
        ```json
        {
          "error": "Access denied. Only superadmin can assign superadmin role."
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "error": "Pengguna tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal mengupdate pengguna"
        }
        ```

#### `DELETE /api/users/:id`

*   **Deskripsi**: Menghapus pengguna berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Pengguna 
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Pengguna berhasil dihapus"
        }
        ```
    *   `403 Forbidden`:
        ```json
        {
          "error": "Access denied. Only superadmin can delete users."
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "error": "Pengguna tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal menghapus pengguna"
        }
        ```

### 3. Manajemen Coffee Shop

Mengelola item menu dan pesanan pelanggan untuk coffee shop. Semua endpoint memerlukan autentikasi.

#### Item Menu

##### `GET /api/coffee-shop/menus`

*   **Deskripsi**: Mengambil daftar semua item menu.
*   **Autentikasi**: Diperlukan (Semua pengguna terautentikasi)
*   **Respons**:
    *   `200 OK`:
        ```json
        [
          {
            "id": 1,
            "name": "Espresso",
            "price": 25000,
            "category": "Coffee",
            "description": "Strong black coffee",
            "availability": "available"
          }
        ]
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error",
          "error": "detail_error"
        }
        ```

##### `GET /api/coffee-shop/menus/:id`

*   **Deskripsi**: Mengambil satu item menu berdasarkan ID-nya.
*   **Autentikasi**: Diperlukan (Semua pengguna terautentikasi)
*   **Parameter**:
    *   `id`: ID Item Menu
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "id": 1,
          "name": "Espresso",
          "price": 25000,
          "category": "Coffee",
          "description": "Strong black coffee",
          "availability": "available"
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "ID menu tidak valid."
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Item menu tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error",
          "error": "detail_error"
        }
        ```

##### `POST /api/coffee-shop/menus`

*   **Deskripsi**: Membuat item menu baru.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Body Permintaan**:
    ```json
    {
      "name": "string",
      "price": "number",
      "category": "string",
      "description": "string",
      "availability": "string" // "available" atau "unavailable", default "available"
    }
    ```
*   **Respons**:
    *   `201 Created`:
        ```json
        {
          "message": "Item menu berhasil dibuat",
          "menuItem": {
            "id": 2,
            "name": "Latte",
            "price": 35000,
            "category": "Coffee",
            "description": "Coffee with steamed milk",
            "availability": "available"
          }
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "Pesan error validasi"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error",
          "error": "detail_error"
        }
        ```

##### `PUT /api/coffee-shop/menus/:id`

*   **Deskripsi**: Memperbarui item menu yang sudah ada berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Item Menu 
*   **Body Permintaan**: 
    ```json
    {
      "name": "string (opsional)",
      "price": "number (opsional)",
      "category": "string (opsional)",
      "description": "string (opsional)",
      "availability": "string (opsional)" // "available" atau "unavailable"
    }
    ```
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Item menu berhasil diperbarui",
          "menuItem": {
            "id": 1,
            "name": "Espresso Diperbarui",
            "price": 27000,
            "category": "Coffee",
            "description": "Strong black coffee",
            "availability": "available"
          }
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "Pesan error validasi"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Item menu tidak ditemukan atau tidak ada perubahan yang dilakukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error",
          "error": "detail_error"
        }
        ```

##### `DELETE /api/coffee-shop/menus/:id`

*   **Deskripsi**: Menghapus item menu berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Item Menu 
*   **Respons**:
    *   `204 No Content`
    *   `400 Bad Request`:
        ```json
        {
          "message": "ID menu tidak valid."
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Item menu tidak ditemukan"
        }
        ```
    *   `409 Conflict`:
        ```json
        {
          "message": "Tidak dapat menghapus item menu: Item ini direferensikan dalam pesanan atau keranjang yang sudah ada.",
          "error": "detail_error"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error",
          "error": "detail_error"
        }
        ```

#### Pesanan

##### `POST /api/coffee-shop/orders`

*   **Deskripsi**: Membuat pesanan baru.
*   **Autentikasi**: Diperlukan (Semua pengguna terautentikasi)
*   **Body Permintaan**:
    ```json
    {
      "items": [
        {
          "menuItemId": "number",
          "quantity": "number"
        }
      ],
      "paymentMethod": "string" // "Cash" atau "QRIS"
    }
    ```
*   **Respons**:
    *   `201 Created`:
        ```json
        {
          "message": "Pesanan berhasil dibuat",
          "order": {
            "id": 101,
            "userId": 1,
            "totalPrice": 70000,
            "status": "completed",
            "paymentMethod": "Cash",
            "createdAt": "2025-05-22T10:00:00.000Z",
            "items": [
              {
                "menuItemId": 1,
                "quantity": 2,
                "totalPrice": 50000
              },
              {
                "menuItemId": 2,
                "quantity": 1,
                "totalPrice": 20000
              }
            ]
          }
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "Pesan error validasi"
        }
        ```
    *   `401 Unauthorized`:
        ```json
        {
          "message": "ID Pengguna tidak ditemukan. Autentikasi diperlukan."
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Satu atau lebih item menu tidak ditemukan."
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error saat pembuatan pesanan",
          "error": "detail_error"
        }
        ```

##### `GET /api/coffee-shop/orders/:id`

*   **Deskripsi**: Mengambil pesanan tertentu berdasarkan ID-nya, termasuk item dan metode pembayarannya.
*   **Autentikasi**: Diperlukan (Semua pengguna terautentikasi)
*   **Parameter**:
    *   `id`: ID Pesanan
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "id": 101,
          "user_id": 1,
          "total_price": 70000,
          "status": "completed",
          "created_at": "2025-05-22T10:00:00.000Z",
          "created_by_username": "adminuser",
          "items": [
            {
              "order_item_id": 1,
              "menu_item_id": 1,
              "quantity": 2,
              "item_total_price": 50000,
              "menu_item_name": "Espresso",
              "menu_item_unit_price": 25000
            }
          ],
          "paymentMethod": "Cash"
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "ID pesanan tidak valid."
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Pesanan tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error",
          "error": "detail_error"
        }
        ```

##### `GET /api/coffee-shop/orders`

*   **Deskripsi**: Mengambil daftar semua pesanan.
*   **Autentikasi**: Diperlukan (Semua pengguna terautentikasi)
*   **Respons**:
    *   `200 OK`:
        ```json
        [
          {
            "id": 101,
            "user_id": 1,
            "total_price": 70000,
            "status": "completed",
            "created_at": "2025-05-22T10:00:00.000Z",
            "created_by_username": "adminuser",
            "paymentMethod": "Cash"
          }
        ]
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error",
          "error": "detail_error"
        }
        ```

#### Resi

##### `GET /api/coffee-shop/orders/:id/receipt`

*   **Deskripsi**: Mengambil data untuk membuat resi untuk pesanan tertentu.
*   **Autentikasi**: Diperlukan (Semua pengguna terautentikasi)
*   **Parameter**:
    *   `id`: ID Pesanan 
*   **Respons**:
    *   `200 OK`: (Struktur sama dengan `GET /api/coffee-shop/orders/:id`)
        ```json
        {
          "id": 101,
          "user_id": 1,
          "total_price": 70000,
          "status": "completed",
          "created_at": "2025-05-22T10:00:00.000Z",
          "created_by_username": "adminuser",
          "items": [
            {
              "order_item_id": 1,
              "menu_item_id": 1,
              "quantity": 2,
              "item_total_price": 50000,
              "menu_item_name": "Espresso",
              "menu_item_unit_price": 25000
            }
          ],
          "paymentMethod": "Cash"
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "ID pesanan tidak valid untuk pembuatan resi."
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Pesanan tidak ditemukan untuk pembuatan resi"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Internal Server Error",
          "error": "detail_error"
        }
        ```

### 4. Manajemen Inventaris

Mengelola item inventaris.

#### `GET /api/inventaris`

*   **Deskripsi**: Mengambil daftar semua item inventaris. Dapat difilter berdasarkan kategori.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter Kueri**:
    *   `category`: `string` (opsional) - Filter berdasarkan kategori item (tidak peka huruf besar/kecil).
*   **Respons**:
    *   `200 OK`:
        ```json
        [
          {
            "id": 1,
            "item_name": "Biji Kopi",
            "stock": 50,
            "minimum_stock": 10,
            "category": "Bahan Baku",
            "image_url": "uploads/inventaris/image-123.png",
            "expiration_date": "2026-12-31T00:00:00.000Z"
          }
        ]
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal mengambil data inventaris"
        }
        ```

#### `POST /api/inventaris`

*   **Deskripsi**: Membuat item inventaris baru. Mendukung unggah gambar.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Body Permintaan**: `multipart/form-data`
    *   `item_name`: `string`
    *   `stock`: `number`
    *   `minimum_stock`: `number`
    *   `category`: `string`
    *   `expiration_date`: `string` (string tanggal ISO 8601, contoh: "2026-12-31")
    *   `image`: `file` (opsional) - File gambar untuk item.
*   **Respons**:
    *   `201 Created`:
        ```json
        {
          "message": "Inventaris berhasil dibuat"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal membuat inventaris"
        }
        ```

#### `PUT /api/inventaris/:id`

*   **Deskripsi**: Memperbarui item inventaris yang sudah ada berdasarkan ID. Mendukung unggah atau penghapusan gambar.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Item Inventaris 
*   **Body Permintaan**: `multipart/form-data` 
    *   `item_name`: `string` (opsional)
    *   `stock`: `number` (opsional)
    *   `category`: `string` (opsional)
    *   `expiration_date`: `string` (opsional, string tanggal ISO 8601)
    *   `image`: `file` (opsional) - File gambar baru.
    *   `image_url`: `string` (opsional, atur ke string kosong `""` untuk menghapus gambar yang sudah ada)
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Inventaris berhasil diperbarui"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "error": "Inventaris tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal memperbarui inventaris"
        }
        ```

#### `DELETE /api/inventaris/:id`

*   **Deskripsi**: Menghapus item inventaris berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Item Inventaris
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Inventaris berhasil dihapus"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "error": "Inventaris tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal menghapus inventaris"
        }
        ```

### 5. Manajemen Keuangan

Mengelola transaksi keuangan (pemasukan/pengeluaran).

#### `GET /api/keuangan/detail`

*   **Deskripsi**: Mengambil semua transaksi keuangan. Dapat difilter berdasarkan kategori dan periode.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter Kueri**:
    *   `category`: `string` (opsional) - Filter berdasarkan kategori transaksi.
    *   `period`: `string` (opsional) - Filter berdasarkan periode waktu. Nilai yang valid: `today` (hari ini), `last7days` (7 hari terakhir), `thisMonth` (bulan ini), `thisYear` (tahun ini), `allTime` (semua waktu, default jika tidak disediakan).
*   **Respons**:
    *   `200 OK`:
        ```json
        [
          {
            "id": 1,
            "type": "income",
            "amount": 50000,
            "description": "Pesanan Coffee Shop #101",
            "category": "Penjualan Coffee Shop",
            "payment_method": "Cash",
            "created_at": "2025-05-22 10:00:00",
            "created_by_username": "adminuser"
          }
        ]
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal mengambil data transaksi"
        }
        ```

#### `POST /api/keuangan/detail`

*   **Deskripsi**: Menambahkan transaksi keuangan baru.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Body Permintaan**:
    ```json
    {
      "type": "string",        // "income" (pemasukan) atau "expense" (pengeluaran)
      "amount": "number",
      "description": "string", // opsional
      "category": "string",
      "payment_method": "string" // opsional
    }
    ```
*   **Respons**:
    *   `201 Created`:
        ```json
        {
          "id": 2,
          "type": "expense",
          "amount": 15000,
          "description": "Pembelian bahan baku",
          "category": "Supplies",
          "payment_method": "Cash",
          "created_at": "2025-05-22T11:00:00.000Z",
          "updated_at": "2025-05-22T11:00:00.000Z",
          "created_by": 1
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "error": "Pesan error validasi"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal menambahkan transaksi internal server."
        }
        ```

#### `PUT /api/keuangan/detail/:id`

*   **Deskripsi**: Memperbarui transaksi keuangan yang sudah ada berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Transaksi
*   **Body Permintaan**:
    ```json
    {
      "type": "string",        // "income" (pemasukan) atau "expense" (pengeluaran)
      "amount": "number",
      "description": "string",
      "payment_method": "string",
      "category": "string"
    }
    ```
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Transaksi berhasil diperbarui",
          "transaction": {
            "id": 1,
            "type": "income",
            "amount": 55000,
            "description": "Pesanan diperbarui",
            "category": "Penjualan Coffee Shop",
            "payment_method": "QRIS",
            "created_at": "2025-05-22T10:00:00.000Z",
            "updated_at": "2025-05-22T12:00:00.000Z",
            "created_by": 1
          }
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "error": "Pesan error validasi"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "error": "Transaksi tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal mengupdate transaksi"
        }
        ```

#### `DELETE /api/keuangan/detail/:id`

*   **Deskripsi**: Menghapus transaksi keuangan berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Transaksi
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Transaksi berhasil dihapus"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "error": "Transaksi tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "error": "Gagal menghapus transaksi"
        }
        ```

### 6. Manajemen Kos

Mengelola kamar kos dan catatan pembayaran.

#### Kamar Kos

##### `GET /api/kos`

*   **Deskripsi**: Mengambil daftar semua kamar kos, termasuk status pembayaran bulan berjalan.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Respons**:
    *   `200 OK`:
        ```json
        [
          {
            "id": 1,
            "room_name": "Kamar A1",
            "price": 1500000,
            "facilities": "AC, Kamar Mandi Dalam",
            "availability": true,
            "tenant_name": "Budi",
            "tenant_phone": "081234567890",
            "parent_name": "Orang Tua Budi",
            "parent_phone": "089876543210",
            "occupation": "Mahasiswa",
            "payment_status_current_month": "Lunas"
          }
        ]
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Server error",
          "error": "detail_error"
        }
        ```

##### `GET /api/kos/:id`

*   **Deskripsi**: Mengambil satu kamar kos berdasarkan ID-nya.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Kamar 
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "id": 1,
          "room_name": "Kamar A1",
          "price": 1500000,
          "facilities": "AC, Kamar Mandi Dalam",
          "availability": true,
          "tenant_name": "Budi",
          "tenant_phone": "081234567890",
          "parent_name": "Orang Tua Budi",
            "parent_phone": "089876543210",
            "occupation": "Mahasiswa",
            "payment_status_current_month": "Lunas"
          }
        ]
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "ID kamar tidak valid"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Kamar kos tidak ditemukan"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Server error",
          "error": "detail_error"
        }
        ```

##### `POST /api/kos`

*   **Deskripsi**: Membuat kamar kos baru.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Body Permintaan**:
    ```json
    {
      "room_name": "string",
      "price": "number",
      "facilities": "string (opsional)",
      "availability": "boolean (opsional, default: true)",
      "tenant_name": "string (opsional)",
      "tenant_phone": "string (opsional)",
      "parent_name": "string (opsional)",
      "parent_phone": "string (opsional)",
      "occupation": "string (opsional)"
    }
    ```
*   **Respons**:
    *   `201 Created`:
        ```json
        {
          "message": "Kamar kos berhasil dibuat",
          "room": {
            "id": 2,
            "room_name": "Kamar B2",
            "price": 1200000,
            "facilities": null,
            "availability": true,
            "tenant_name": null,
            "tenant_phone": null,
            "parent_name": null,
            "parent_phone": null,
            "occupation": null,
            "payment_status_current_month": "Belum Bayar"
          }
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "Pesan error validasi"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Server error",
          "error": "detail_error"
        }
        ```

##### `PUT /api/kos/:id`

*   **Deskripsi**: Memperbarui kamar kos yang sudah ada berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Kamar 
*   **Body Permintaan**: (Semua bidang opsional untuk pembaruan parsial, tetapi `room_name` dan `price` diperlukan jika disediakan)
    ```json
    {
      "room_name": "string (opsional)",
      "price": "number (opsional)",
      "facilities": "string (opsional)",
      "availability": "boolean (opsional)",
      "tenant_name": "string (opsional)",
      "tenant_phone": "string (opsional)",
      "parent_name": "string (opsional)",
      "parent_phone": "string (opsional)",
      "occupation": "string (opsional)",
      "payment_status_current_month": "string (opsional)" // "Lunas", "Belum Bayar", "Pending Verifikasi"
    }
    ```
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Kamar kos dengan ID 1 berhasil diperbarui",
          "room": {
            "id": 1,
            "room_name": "Kamar A1 Diperbarui",
            "price": 1600000,
            "facilities": "AC, Kamar Mandi Dalam, WiFi",
            "availability": true,
            "tenant_name": "Budi",
            "tenant_phone": "081234567890",
            "parent_name": "Orang Tua Budi",
            "parent_phone": "089876543210",
            "occupation": "Mahasiswa",
            "payment_status_current_month": "Lunas"
          }
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "Pesan error validasi"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Kamar kos tidak ditemukan untuk diperbarui"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Server error",
          "error": "detail_error"
        }
        ```

##### `DELETE /api/kos/:id`

*   **Deskripsi**: Menghapus kamar kos berdasarkan ID.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `id`: ID Kamar
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Kamar kos dengan ID 1 berhasil dihapus"
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "Tidak dapat menghapus kamar. Mungkin ada catatan pembayaran terkait.",
          "detail": "detail_error"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Kamar kos tidak ditemukan untuk dihapus"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Server error",
          "error": "detail_error"
        }
        ```

#### Pembayaran Kos

##### `GET /api/kos/:roomId/payment-history`

*   **Deskripsi**: Mengambil riwayat pembayaran untuk kamar kos tertentu.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `roomId`: ID Kamar 
*   **Respons**:
    *   `200 OK`:
        ```json
        [
          {
            "id": 1,
            "penghuni_id": 1,
            "bulan_tagihan": "2025-05",
            "tanggal_pembayaran_lunas": "2025-05-10T00:00:00.000Z",
            "jumlah_bayar": 1500000,
            "status_pembayaran": "Lunas",
            "metode_pembayaran": "Transfer Bank",
            "catatan_pembayaran": "Pembayaran bulan Mei",
            "bukti_transfer_path": "uploads/bukti_pembayaran_kos/buktiTransferImage-123.jpg",
            "created_at": "2025-05-10T08:00:00.000Z",
            "updated_at": "2025-05-10T08:00:00.000Z"
          }
        ]
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "ID kamar tidak valid"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Server error saat mengambil riwayat pembayaran",
          "error": "detail_error"
        }
        ```

##### `POST /api/kos/pembayaran`

*   **Deskripsi**: Menambahkan catatan pembayaran kos baru. Mendukung unggah gambar untuk bukti transfer.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Body Permintaan**: `multipart/form-data`
    *   `penghuni_id`: `number` (ID Kamar)
    *   `bulan_tagihan`: `string` (Format: YYYY-MM, contoh: "2025-05")
    *   `jumlah_bayar`: `number`
    *   `tanggal_pembayaran_lunas`: `string` (string tanggal ISO 8601, contoh: "2025-05-10", diperlukan jika `status_pembayaran` adalah "Lunas")
    *   `status_pembayaran`: `string` (Nilai yang valid: "Lunas", "Belum Bayar", "Pending Verifikasi")
    *   `metode_pembayaran`: `string` (opsional, contoh: "Transfer Bank", "Cash")
    *   `catatan_pembayaran`: `string` (opsional)
    *   `buktiTransferImage`: `file` (opsional) - File gambar untuk bukti transfer.
*   **Respons**:
    *   `201 Created`:
        ```json
        {
          "message": "Pembayaran kos berhasil ditambahkan dan dicatat di keuangan",
          "payment": {
            "id": 2,
            "penghuni_id": 1,
            "bulan_tagihan": "2025-06",
            "jumlah_bayar": 1500000,
            "tanggal_pembayaran_lunas": null,
            "status_pembayaran": "Pending Verifikasi",
            "metode_pembayaran": "QRIS",
            "catatan_pembayaran": "Pembayaran bulan Juni via QRIS",
            "bukti_transfer_path": "uploads/bukti_pembayaran_kos/buktiTransferImage-456.jpg",
            "created_at": "2025-05-22T13:00:00.000Z",
            "updated_at": "2025-05-22T13:00:00.000Z"
          }
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "Pesan error validasi",
          "detail": "detail_error (opsional)"
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Server error saat menambahkan pembayaran kos",
          "error": "detail_error"
        }
        ```

##### `PUT /api/kos/pembayaran/:paymentId/status`

*   **Deskripsi**: Memperbarui status pembayaran catatan pembayaran kos.
*   **Autentikasi**: Diperlukan (Hanya Superadmin)
*   **Parameter**:
    *   `paymentId`: ID Pembayaran 
*   **Body Permintaan**:
    ```json
    {
      "status_pembayaran": "string", // "Lunas", "Belum Bayar", "Pending Verifikasi"
      "tanggal_pembayaran_lunas": "string (opsional)" // string tanggal ISO 8601, diperlukan jika status adalah "Lunas"
    }
    ```
*   **Respons**:
    *   `200 OK`:
        ```json
        {
          "message": "Status pembayaran berhasil diupdate menjadi Lunas",
          "payment": {
            "id": 2,
            "penghuni_id": 1,
            "bulan_tagihan": "2025-06",
            "jumlah_bayar": 1500000,
            "tanggal_pembayaran_lunas": "2025-05-22T00:00:00.000Z",
            "status_pembayaran": "Lunas",
            "metode_pembayaran": "QRIS",
            "catatan_pembayaran": "Pembayaran bulan Juni via QRIS",
            "created_at": "2025-05-22T13:00:00.000Z",
            "updated_at": "2025-05-22T14:00:00.000Z"
          }
        }
        ```
    *   `400 Bad Request`:
        ```json
        {
          "message": "Pesan error validasi"
        }
        ```
    *   `404 Not Found`:
        ```json
        {
          "message": "Data pembayaran tidak ditemukan."
        }
        ```
    *   `500 Internal Server Error`:
        ```json
        {
          "message": "Server error saat mengupdate status pembayaran",
          "error": "detail_error"
        }
