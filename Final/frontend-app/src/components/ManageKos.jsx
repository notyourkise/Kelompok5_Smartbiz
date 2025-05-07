import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button, Modal, Form, Table, Dropdown, DropdownButton } from "react-bootstrap";
import { FaTrashAlt, FaEdit, FaPlus, FaArrowLeft, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from './Footer';
import './ManageKos.css'; // Ensure this CSS file is adapted or created

const ManageKos = () => {
  const navigate = useNavigate();
  const [kosRooms, setKosRooms] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({
    id: null,
    room_name: '',
    price: '',
    facilities: '',
    availability: true,
  });

  const API_URL = 'http://localhost:3001/api/kos';

  const fetchKosRooms = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
      }
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKosRooms(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch kos rooms');
      console.error('Fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchKosRooms();
  }, [fetchKosRooms]);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentRoom({
      ...currentRoom,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }
    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `${API_URL}/${currentRoom.id}` : API_URL;

    try {
      await axios[method](url, currentRoom, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKosRooms();
      setShowModal(false);
      setIsEditing(false);
      setCurrentRoom({ id: null, room_name: '', price: '', facilities: '', availability: true });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} kos room`);
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (room) => {
    setCurrentRoom({ ...room, price: room.price.toString() }); // Ensure price is string for form input
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found.');
        return;
      }
      try {
        await axios.delete(`${API_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchKosRooms();
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete kos room');
        console.error('Delete error:', err);
      }
    }
  };

  const openAddModal = () => {
    setCurrentRoom({ id: null, room_name: '', price: '', facilities: '', availability: true });
    setIsEditing(false);
    setShowModal(true);
  };

  return (
    <div className="manage-kost-finance-container"> {/* Use finance container class */}
      <header className="manage-kost-finance-header"> {/* Use finance header class */}
        <FaArrowLeft className="back-icon" onClick={handleBack} />
        <h2 className="manage-kost-finance-title">Manajemen Kamar Kos</h2>
      </header>

      {error && <p className="error-message">{error}</p>}

      <Button
        variant="success"
        onClick={openAddModal}
        className="action-button"
      >
        <FaPlus /> Tambah Kamar
      </Button>

      <div className="table-responsive">
        <Table striped bordered hover className="finance-table"> {/* Use finance table class */}
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Kamar</th>
              <th>Harga</th>
              <th>Fasilitas</th>
              <th>Ketersediaan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kosRooms.length > 0 ? (
              kosRooms.map((room, index) => (
                <tr key={room.id}>
                  <td>{index + 1}</td>
                  <td>{room.room_name}</td>
                  <td>Rp {Number(room.price).toLocaleString('id-ID')}</td>
                  <td>{room.facilities}</td>
                  <td>{room.availability ? 'Tersedia' : 'Tidak Tersedia'}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(room)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(room.id)}
                    >
                      <FaTrashAlt /> Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">Belum ada data kamar kos.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Footer />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Kamar' : 'Tambah Kamar Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Kamar</Form.Label>
              <Form.Control
                type="text"
                name="room_name"
                value={currentRoom.room_name}
                onChange={handleInputChange}
                placeholder="Masukkan Nama Kamar"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Harga (Rp)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={currentRoom.price}
                onChange={handleInputChange}
                placeholder="Masukkan Harga"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fasilitas</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="facilities"
                value={currentRoom.facilities}
                onChange={handleInputChange}
                placeholder="Masukkan Fasilitas"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Tersedia"
                name="availability"
                checked={currentRoom.availability}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageKos;
