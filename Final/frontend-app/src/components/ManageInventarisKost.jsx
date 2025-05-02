import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Table } from "react-bootstrap"; 
import { FaTrashAlt, FaEdit, FaPlus, FaArrowLeft } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom"; 
import Footer from './Footer';
import './ManageInventarisKost.css'; // Import CSS khusus untuk Kost

const ManageInventarisKost = () => {
  const navigate = useNavigate();
  const [inventaris, setInventaris] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [newItem, setNewItem] = useState({ item_name: "", stock: 0, minimum_stock: 0 }); 
  const [editingItem, setEditingItem] = useState(null);

  const fetchInventaris = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot fetch inventaris.");
      return;
    }
    try {
      const response = await axios.get("http://localhost:3001/api/inventaris?category=kost", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventaris(response.data);
    } catch (error) {
      console.error("Error fetching inventaris:", error);
    }
  };

  useEffect(() => {
    fetchInventaris();
  }, []);

  const handleBack = () => navigate("/dashboard"); 

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
      setInventaris(inventaris.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleCreateModal = () => setShowCreateModal(true);
  const handleNewItemInputChange = (e) => setNewItem({ ...newItem, [e.target.name]: e.target.value });
  const handleEditingItemInputChange = (e) => setEditingItem({ ...editingItem, [e.target.name]: e.target.value });

  const handleCreateItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot create item.");
      return;
    }
  
    try {
      const newItemWithCategory = {
        ...newItem,
        category: "kost", // Menambahkan kategori kost
      };
  
      await axios.post("http://localhost:3001/api/inventaris", newItemWithCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setShowCreateModal(false);
      setNewItem({ item_name: "", stock: 0, minimum_stock: 0 });
      fetchInventaris();
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };
  

  const handleEditClick = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

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
      setShowEditModal(false);
      setEditingItem(null);
      fetchInventaris();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="manage-inventaris-container"> 
      <header className="manage-inventaris-header">
        <Button variant="secondary" onClick={handleBack} className="back-button">
          <FaArrowLeft />
        </Button>
        <h2 className="manage-inventaris-title">Manajemen Inventaris Kost</h2>
        <Button variant="primary" onClick={handleCreateModal} className="action-button">
          <FaPlus /> Tambah Item
        </Button>
      </header>

      <div className="table-responsive">
        <Table striped bordered hover className="inventaris-table">
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
                  <td>
                    {item.stock}
                    {item.stock <= item.minimum_stock && (
                      <span className="stock-warning"> Minimum Stock!</span>
                    )}
                  </td>
                  <td>{item.minimum_stock}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(item)}>
                      <FaEdit /> Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
                      <FaTrashAlt /> Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center">Tidak ada data inventaris.</td></tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton><Modal.Title>Tambah Item Inventaris</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Item</Form.Label>
              <Form.Control type="text" name="item_name" value={newItem.item_name} onChange={handleNewItemInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stok</Form.Label>
              <Form.Control type="number" name="stock" value={newItem.stock} onChange={handleNewItemInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Stock</Form.Label>
              <Form.Control type="number" name="minimum_stock" value={newItem.minimum_stock} onChange={handleNewItemInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleCreateItem}>Simpan</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit Item Inventaris</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nama Item</Form.Label>
              <Form.Control type="text" name="item_name" value={editingItem?.item_name || ""} onChange={handleEditingItemInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stok</Form.Label>
              <Form.Control type="number" name="stock" value={editingItem?.stock || ""} onChange={handleEditingItemInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Stock</Form.Label>
              <Form.Control type="number" name="minimum_stock" value={editingItem?.minimum_stock || ""} onChange={handleEditingItemInputChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleUpdateItem}>Simpan Perubahan</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default ManageInventarisKost;
