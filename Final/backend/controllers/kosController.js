const pool = require('../config/db');

// Helper untuk mendapatkan bulan dan tahun saat ini dalam format YYYY-MM
function getCurrentBillingMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

// @desc    Get all kos rooms
// @route   GET /api/kos
// @access  Private (Superadmin/Admin)
const getAllKosRooms = async (req, res) => {
  try {
    const roomsQuery = `
      SELECT
          r.id, r.room_name, r.price, r.facilities, r.availability,
          r.tenant_name, r.tenant_phone, r.parent_name, r.parent_phone, r.occupation,
          r.payment_status_current_month
      FROM
          rooms r
      ORDER BY
          r.id ASC;
    `;
    const roomsResult = await pool.query(roomsQuery);

    const currentBillingMonth = getCurrentBillingMonth();

    const roomsDataWithPaymentStatus = await Promise.all(
      roomsResult.rows.map(async (room) => {
        let currentMonthPaymentStatus = room.payment_status_current_month; 

        const paymentCheckQuery = `
          SELECT status_pembayaran FROM pembayaran_kos
          WHERE penghuni_id = $1 AND bulan_tagihan = $2
          ORDER BY created_at DESC LIMIT 1;
        `;
        const paymentCheckResult = await pool.query(paymentCheckQuery, [room.id, currentBillingMonth]);

        if (paymentCheckResult.rows.length > 0) {
          currentMonthPaymentStatus = paymentCheckResult.rows[0].status_pembayaran;
        } else {
          currentMonthPaymentStatus = 'Belum Bayar';
        }
        
        return {
          ...room,
          payment_status_current_month: currentMonthPaymentStatus,
        };
      })
    );

    res.status(200).json(roomsDataWithPaymentStatus);
  } catch (error) {
    console.error('Error in getAllKosRooms:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single kos room by ID
// @route   GET /api/kos/:id
// @access  Private (Superadmin/Admin)
const getKosRoomById = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);
    if (isNaN(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [roomId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kos room not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error in getKosRoomById:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new kos room
// @route   POST /api/kos
// @access  Private (Superadmin)
const createKosRoom = async (req, res) => {
  try {
    const { 
      room_name, price, facilities, availability,
      tenant_name, tenant_phone, parent_name, parent_phone, occupation
    } = req.body;

    if (!room_name || price === undefined || price === null) {
      return res.status(400).json({ message: 'Room name and price are required' });
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
        return res.status(400).json({ message: 'Price must be a valid number' });
    }
    const payment_status_current_month = 'Belum Bayar';

    const query = `
      INSERT INTO rooms 
        (room_name, price, facilities, availability, tenant_name, tenant_phone, parent_name, parent_phone, occupation, payment_status_current_month) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `;
    const values = [
      room_name, numericPrice, facilities, availability === undefined ? true : availability,
      tenant_name || null, tenant_phone || null, parent_name || null, parent_phone || null, occupation || null, payment_status_current_month
    ];
    
    const result = await pool.query(query, values);
    res.status(201).json({ message: 'Kos room created successfully', room: result.rows[0] });
  } catch (error) {
    console.error('Error in createKosRoom:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a kos room by ID
// @route   PUT /api/kos/:id
// @access  Private (Superadmin)
const updateKosRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);
    if (isNaN(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    const { 
      room_name, price, facilities, availability,
      tenant_name, tenant_phone, parent_name, parent_phone, occupation, payment_status_current_month
    } = req.body;

    if (!room_name || price === undefined || price === null) {
      return res.status(400).json({ message: 'Room name and price are required' });
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
        return res.status(400).json({ message: 'Price must be a valid number' });
    }

    const query = `
      UPDATE rooms 
      SET room_name = $1, price = $2, facilities = $3, availability = $4, 
          tenant_name = $5, tenant_phone = $6, parent_name = $7, parent_phone = $8, 
          occupation = $9, payment_status_current_month = $10
      WHERE id = $11 
      RETURNING *
    `;
    const values = [
      room_name, numericPrice, facilities, availability,
      tenant_name, tenant_phone, parent_name, parent_phone, occupation, payment_status_current_month,
      roomId
    ];

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kos room not found to update' });
    }
    res.status(200).json({ message: `Kos room with ID ${roomId} updated successfully`, room: result.rows[0] });
  } catch (error) {
    console.error('Error in updateKosRoom:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a kos room by ID
// @route   DELETE /api/kos/:id
// @access  Private (Superadmin)
const deleteKosRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);
    if (isNaN(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [roomId]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Kos room not found to delete'});
    }
    res.status(200).json({ message: `Kos room with ID ${roomId} deleted successfully` });
  } catch (error) {
    console.error('Error in deleteKosRoom:', error);
    if (error.code === '23503') { 
        return res.status(400).json({ message: 'Cannot delete room. It may have associated payment records.', detail: error.detail });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateRoomPaymentStatusForCurrentMonth = async (client, roomId, newStatusInKosTable) => {
    const currentBillingMonth = getCurrentBillingMonth();
    let statusToUpdateInRooms = 'Belum Bayar'; 

    if (newStatusInKosTable === 'Lunas') {
        statusToUpdateInRooms = 'Lunas';
    } else {
        const lunasCheckQuery = `
            SELECT 1 FROM pembayaran_kos
            WHERE penghuni_id = $1 AND bulan_tagihan = $2 AND status_pembayaran = 'Lunas'
            LIMIT 1;
        `;
        const lunasCheckResult = await client.query(lunasCheckQuery, [roomId, currentBillingMonth]);
        if (lunasCheckResult.rows.length > 0) {
            statusToUpdateInRooms = 'Lunas';
        } else {
            statusToUpdateInRooms = newStatusInKosTable === 'Pending Verifikasi' ? 'Pending Verifikasi' : 'Belum Bayar';
        }
    }
    
    await client.query(
        'UPDATE rooms SET payment_status_current_month = $1 WHERE id = $2',
        [statusToUpdateInRooms, roomId]
    );
};

const getPaymentHistoryByRoomId = async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId, 10); 
    if (isNaN(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' });
    }
    const query = `
      SELECT 
        id, penghuni_id, bulan_tagihan, tanggal_pembayaran_lunas, jumlah_bayar, 
        status_pembayaran, metode_pembayaran, catatan_pembayaran, bukti_transfer_path,
        created_at, updated_at
      FROM pembayaran_kos 
      WHERE penghuni_id = $1 
      ORDER BY bulan_tagihan DESC, COALESCE(tanggal_pembayaran_lunas, created_at) DESC;
    `;
    const result = await pool.query(query, [roomId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in getPaymentHistoryByRoomId:', error);
    res.status(500).json({ message: 'Server error while fetching payment history', error: error.message });
  }
};

const addPembayaranKos = async (req, res) => {
  const client = await pool.connect(); 
  try {
    console.log("Entering addPembayaranKos function"); // LOG 1
    const {
      penghuni_id, bulan_tagihan, jumlah_bayar, tanggal_pembayaran_lunas, 
      status_pembayaran, metode_pembayaran, catatan_pembayaran, bukti_transfer_path
    } = req.body;
    
    console.log("req.user:", JSON.stringify(req.user, null, 2)); // LOG 2
    const created_by = req.user ? req.user.id : null; // Ambil ID admin dari token, beri null jika req.user tidak ada
    console.log("Extracted created_by:", created_by); // LOG 3

    if (!penghuni_id || !bulan_tagihan || jumlah_bayar === undefined || !status_pembayaran || !created_by) {
      console.log("Validation failed: Data tidak lengkap."); // LOG 4
      console.log({ penghuni_id, bulan_tagihan, jumlah_bayar, status_pembayaran, created_by }); // LOG detail validasi
      return res.status(400).json({ message: 'Data tidak lengkap: penghuni_id, bulan_tagihan, jumlah_bayar, status_pembayaran, dan created_by (admin) diperlukan.' });
    }
    if (status_pembayaran === 'Lunas' && !tanggal_pembayaran_lunas) {
        console.log("Validation failed: Tanggal lunas diperlukan untuk status Lunas."); // LOG 5
        return res.status(400).json({ message: 'Tanggal pembayaran lunas diperlukan jika status adalah Lunas.' });
    }
    const numericJumlahBayar = parseFloat(jumlah_bayar);
    if (isNaN(numericJumlahBayar) || numericJumlahBayar < 0) {
        console.log("Validation failed: Jumlah bayar tidak valid.", jumlah_bayar); // LOG 6
        return res.status(400).json({ message: 'Jumlah bayar tidak valid.' });
    }
    console.log("Initial validations passed. Starting transaction."); // LOG 7
    await client.query('BEGIN'); 

    // 1. Insert ke pembayaran_kos
    console.log("Attempting to insert into pembayaran_kos"); // LOG 8
    const pembayaranKosQuery = `
      INSERT INTO pembayaran_kos 
        (penghuni_id, bulan_tagihan, jumlah_bayar, tanggal_pembayaran_lunas, status_pembayaran, metode_pembayaran, catatan_pembayaran, bukti_transfer_path, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const pembayaranKosValues = [
      parseInt(penghuni_id), bulan_tagihan, numericJumlahBayar, // Pastikan penghuni_id adalah integer
      tanggal_pembayaran_lunas || null, status_pembayaran, metode_pembayaran || null, 
      catatan_pembayaran || null, bukti_transfer_path || null
    ];
    const pembayaranKosResult = await client.query(pembayaranKosQuery, pembayaranKosValues);
    const newPayment = pembayaranKosResult.rows[0];
    console.log("Inserted into pembayaran_kos:", newPayment); // LOG 9

    // 2. Insert ke transactions
    console.log("Attempting to get room info for transaction description"); // LOG 10
    const roomInfoQuery = await client.query('SELECT room_name, tenant_name FROM rooms WHERE id = $1', [newPayment.penghuni_id]);
    const roomName = roomInfoQuery.rows.length > 0 ? roomInfoQuery.rows[0].room_name : `ID ${newPayment.penghuni_id}`;
    const tenantName = roomInfoQuery.rows.length > 0 ? roomInfoQuery.rows[0].tenant_name : 'Penghuni';
    console.log(`Room Name: ${roomName}, Tenant Name: ${tenantName}`); // LOG 11
    
    const transactionDescription = `Pembayaran Kos Kamar ${roomName} (${tenantName}) - Bulan ${bulan_tagihan}`;
    const transactionCategory = 'Pendapatan Kos';

    console.log("Attempting to insert into transactions"); // LOG 12
    const transactionQuery = `
      INSERT INTO transactions
        (type, amount, description, category, payment_method, created_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id;
    `;
    const transactionValues = [
      'income', numericJumlahBayar, transactionDescription, transactionCategory, 
      newPayment.metode_pembayaran, created_by
    ];
    await client.query(transactionQuery, transactionValues);
    console.log("Inserted into transactions"); // LOG 13

    // 3. Update status di tabel rooms
    if (newPayment.bulan_tagihan === getCurrentBillingMonth()) {
        console.log("Attempting to update room payment status for current month"); // LOG 14
        await updateRoomPaymentStatusForCurrentMonth(client, newPayment.penghuni_id, newPayment.status_pembayaran);
        console.log("Room payment status updated"); // LOG 15
    }
    
    await client.query('COMMIT'); 
    console.log("Transaction committed"); // LOG 16
    res.status(201).json({ message: 'Pembayaran kos berhasil ditambahkan dan dicatat di keuangan', payment: newPayment });

  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error('Error in addPembayaranKos (with transaction):', error); // Ini akan menangkap error SQL
    if (error.code === '23503') { 
        if (error.constraint && error.constraint.includes('pembayaran_kos_penghuni_id')) {
             return res.status(400).json({ message: 'Penghuni ID (Room ID) tidak valid.', detail: error.detail });
        } else if (error.constraint && error.constraint.includes('transactions_created_by_fkey')) {
            return res.status(400).json({ message: 'ID Admin (created_by) tidak valid untuk tabel transaksi.', detail: error.detail });
        }
    }
    res.status(500).json({ message: 'Server error saat menambahkan pembayaran kos', error: error.message });
  } finally {
    client.release(); 
    console.log("Client released"); // LOG 17
  }
};

const updateStatusPembayaranKos = async (req, res) => {
  const client = await pool.connect();
  try {
    // ... (kode updateStatusPembayaranKos seperti sebelumnya, bisa ditambahkan logging serupa jika perlu) ...
    const paymentId = parseInt(req.params.paymentId, 10);
    const { status_pembayaran, tanggal_pembayaran_lunas } = req.body; 

    if (isNaN(paymentId)) {
      return res.status(400).json({ message: 'ID Pembayaran tidak valid.' });
    }
    if (!status_pembayaran) {
      return res.status(400).json({ message: 'Status pembayaran diperlukan.' });
    }
    if (status_pembayaran === 'Lunas' && !tanggal_pembayaran_lunas) {
        return res.status(400).json({ message: 'Tanggal pembayaran lunas diperlukan jika status diubah menjadi Lunas.' });
    }

    await client.query('BEGIN');

    const oldPaymentQuery = await client.query('SELECT penghuni_id, bulan_tagihan, status_pembayaran as old_status FROM pembayaran_kos WHERE id = $1', [paymentId]);
    if (oldPaymentQuery.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Data pembayaran tidak ditemukan.' });
    }
    const { penghuni_id, bulan_tagihan, old_status } = oldPaymentQuery.rows[0];

    const query = `
      UPDATE pembayaran_kos
      SET status_pembayaran = $1, 
          tanggal_pembayaran_lunas = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    const values = [status_pembayaran, (status_pembayaran === 'Lunas' ? tanggal_pembayaran_lunas : null), paymentId];
    const result = await client.query(query, values);
    const updatedPayment = result.rows[0];

    if (bulan_tagihan === getCurrentBillingMonth()) {
        await updateRoomPaymentStatusForCurrentMonth(client, penghuni_id, updatedPayment.status_pembayaran);
    }
    
    await client.query('COMMIT');
    res.status(200).json({ message: `Status pembayaran berhasil diupdate menjadi ${status_pembayaran}`, payment: updatedPayment });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in updateStatusPembayaranKos:', error);
    res.status(500).json({ message: 'Server error saat mengupdate status pembayaran', error: error.message });
  } finally {
    client.release();
  }
};

module.exports = {
  getAllKosRooms, getKosRoomById, createKosRoom, updateKosRoom, deleteKosRoom,
  getPaymentHistoryByRoomId, addPembayaranKos, updateStatusPembayaranKos,
};
