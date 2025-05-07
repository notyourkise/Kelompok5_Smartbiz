const pool = require('../config/db');

// @desc    Get all kos rooms
// @route   GET /api/kos
// @access  Private (Superadmin)
const getAllKosRooms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rooms ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error in getAllKosRooms:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single kos room by ID
// @route   GET /api/kos/:id
// @access  Private (Superadmin)
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
    const { room_name, price, facilities, availability } = req.body;

    // Basic validation
    if (!room_name || price === undefined || price === null) {
      return res.status(400).json({ message: 'Room name and price are required' });
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
        return res.status(400).json({ message: 'Price must be a valid number' });
    }

    const result = await pool.query(
      'INSERT INTO rooms (room_name, price, facilities, availability) VALUES ($1, $2, $3, $4) RETURNING *',
      [room_name, numericPrice, facilities, availability === undefined ? true : availability]
    );
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
    const { room_name, price, facilities, availability } = req.body;

    // Basic validation
    if (!room_name || price === undefined || price === null) {
      return res.status(400).json({ message: 'Room name and price are required' });
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
        return res.status(400).json({ message: 'Price must be a valid number' });
    }

    const result = await pool.query(
      'UPDATE rooms SET room_name = $1, price = $2, facilities = $3, availability = $4 WHERE id = $5 RETURNING *',
      [room_name, numericPrice, facilities, availability, roomId]
    );
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllKosRooms,
  getKosRoomById,
  createKosRoom,
  updateKosRoom,
  deleteKosRoom,
};
