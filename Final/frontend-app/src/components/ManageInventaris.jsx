import React, { useState, useEffect } from "react";
import axios from "axios";
// Import Card, Row, Col from react-bootstrap
import { Button, Modal, Form, Card, Row, Col } from "react-bootstrap"; 
import { FaTrashAlt, FaEdit, FaPlus, FaArrowLeft, FaInfoCircle } from "react-icons/fa"; // Added FaInfoCircle
import { useNavigate } from "react-router-dom"; // Untuk navigasi
import Footer from './Footer'; // Pastikan Footer diimpor
import './ManageInventaris.css'; // Import the new CSS file

const ManageInventaris = () => {
  const navigate = useNavigate();
  const [inventaris, setInventaris] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal untuk Create
  const [showEditModal, setShowEditModal] = useState(false); // Modal untuk Edit
  const [newItem, setNewItem] = useState({ item_name: "", stock: 0, minimum_stock: 0 }); // Form untuk item baru
  const [editingItem, setEditingItem] = useState(null); // Item yang sedang diedit

  // Mengambil data inventaris dari API
  const fetchInventaris = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot fetch inventaris.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3001/api/inventaris", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventaris(response.data); // Menyimpan data inventaris
    } catch (error) {
      console.error("Error fetching inventaris:", error);
    }
  };

  useEffect(() => {
    fetchInventaris();
  }, []);

  // Fungsi untuk kembali ke halaman dashboard
  const handleBack = () => {
    navigate("/dashboard"); // Arahkan ke halaman Dashboard
  };

  // Fungsi untuk menghapus inventaris
  const handleDelete = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot delete item.");
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/api/inventaris/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventaris(inventaris.filter((item) => item.id !== itemId)); // Menghapus item dari state
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Fungsi untuk membuka modal Create
  const handleCreateModal = () => {
    setShowCreateModal(true);
  };

  // Fungsi untuk menangani input data inventaris baru
  const handleNewItemInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Fungsi untuk menangani input data ketika sedang mengedit item
  const handleEditingItemInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  // Fungsi untuk menambah inventaris baru
  const handleCreateItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot create item.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/inventaris", newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCreateModal(false);
      setNewItem({ item_name: "", stock: 0, minimum_stock: 0 }); // Reset form
      fetchInventaris(); // Refresh data
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  // Fungsi untuk membuka modal Edit
  const handleEditClick = (item) => {
    setEditingItem(item); // Set item yang ingin diedit
    setShowEditModal(true); // Tampilkan modal edit
  };

  // Fungsi untuk memperbarui data inventaris
  const handleUpdateItem = async () => {
    const token = localStorage.getItem("token");
    if (!token || !editingItem) {
      console.error("Authentication token or editing item data not found. Cannot update item.");
      return;
    }
    try {
      await axios.put(`http://localhost:3001/api/inventaris/${editingItem.id}`, editingItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowEditModal(false); // Tutup modal setelah update
      setEditingItem(null); // Reset editing item
      fetchInventaris(); // Refresh data
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    // Use the new container class
    <div className="manage-inventaris-container"> 
      {/* Header with Back Button and Title */}
      <header className="manage-inventaris-header">
        {/* Back Button with CSS class */}
        <Button
          variant="secondary" // Keep variant for base styling, override with class
          onClick={handleBack}
          className="back-button" // Apply CSS class
        >
          <FaArrowLeft />
        </Button>
        <h2 className="manage-inventaris-title">Manajemen Inventaris</h2> {/* Add title */}
        {/* Create Item Button */}
         <Button
          variant="primary" // Keep variant for base styling, override with class
          onClick={handleCreateModal}
          className="action-button" // Apply CSS class
        >
          <FaPlus /> Tambah Item
        </Button>
      </header>

      {/* Inventaris Card Layout */}
      <div className="inventaris-card-list">
        <Row xs={1} md={2} lg={3} className="g-4"> {/* Responsive Grid */}
          {inventaris.length > 0 ? (
            inventaris.map((item) => (
              <Col key={item.id}>
                <Card className="inventaris-card">
                  <div className="card-image-placeholder">
                    {/* Placeholder for image */}
                    <FaInfoCircle className="info-icon" onClick={() => alert(`Info for ${item.item_name}`)} /> {/* Basic info click handler */}
                  </div>
                  <Card.Body>
                    <Card.Title className="item-name">{item.item_name}</Card.Title>
                    <div className="item-details">
                      <p className="item-stock">Stok Barang: {item.stock}
                        {item.stock <= item.minimum_stock && (
                          <span className="stock-warning-text"> (Minimum!)</span>
                        )}
                      </p>
                      <p className="item-min-stock">Minimum Stok: {item.minimum_stock}</p>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="link"
                      size="sm"
                      className="edit-button"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      size="sm"
                      className="delete-button"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center w-100">Tidak ada data inventaris.</p>
            </Col>
          )}
        </Row>
      </div>

      {/* Modal Create Item */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Item Inventaris</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Item</Form.Label>
              <Form.Control
                type="text"
                name="item_name"
                value={newItem.item_name}
                onChange={handleNewItemInputChange}
                placeholder="Masukkan Nama Item"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stok</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={newItem.stock}
                onChange={handleNewItemInputChange}
                placeholder="Masukkan Jumlah Stok"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Stock</Form.Label>
              <Form.Control
                type="number"
                name="minimum_stock"
                value={newItem.minimum_stock}
                onChange={handleNewItemInputChange}
                placeholder="Masukkan Minimum Stok"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleCreateItem}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Edit Item */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Item Inventaris</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Item</Form.Label>
              <Form.Control
                type="text"
                name="item_name"
                value={editingItem?.item_name || ""}
                onChange={handleEditingItemInputChange}
                placeholder="Edit Nama Item"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stok</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={editingItem?.stock || ""}
                onChange={handleEditingItemInputChange}
                placeholder="Edit Jumlah Stok"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Stock</Form.Label>
              <Form.Control
                type="number"
                name="minimum_stock"
                value={editingItem?.minimum_stock || ""}
                onChange={handleEditingItemInputChange}
                placeholder="Edit Minimum Stok"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdateItem}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Include Footer */}
      <Footer />
    </div>
  );
};

export default ManageInventaris;
