import React, { useState, useEffect } from "react";
import axios from "axios";
// Import Table component from react-bootstrap
import { Button, Modal, Form, Table } from "react-bootstrap"; 
import { FaTrashAlt, FaEdit, FaPlus, FaArrowLeft } from "react-icons/fa"; // Remove FaBox, not needed for table
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

      {/* Inventaris Table */}
      <div className="table-responsive"> {/* Make table responsive */}
        <Table striped bordered hover className="inventaris-table"> {/* Add class for potential styling */}
          <thead>
            <tr>
              <th>#</th>
              <th>Nama Item</th>
              <th>Stok</th>
              <th>Minimum Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {inventaris.length > 0 ? (
              inventaris.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.item_name}</td>
                  {/* Add conditional class for stock warning */}
                  <td className={item.stock <= item.minimum_stock ? 'stock-warning' : ''}>
                    {item.stock}
                    {item.stock <= item.minimum_stock && (
                      <span className="warning-text"> (Stok menipis!)</span>
                    )}
                  </td>
                  <td>{item.minimum_stock}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2" // Margin end for spacing
                      onClick={() => handleEditClick(item)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrashAlt /> Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">Tidak ada data inventaris.</td>
              </tr>
            )}
          </tbody>
        </Table>
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
