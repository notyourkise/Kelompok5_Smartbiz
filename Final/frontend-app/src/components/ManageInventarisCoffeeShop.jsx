import React, { useState, useEffect } from "react";
import axios from "axios";
// Import Card instead of Table
import { Button, Modal, Form, Card, Row, Col } from "react-bootstrap";
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa"; // Added FaInfoCircle
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./ManageInventarisCoffeeShop.css"; // Import CSS khusus untuk Coffee Shop

const ManageInventarisCoffeeShop = () => {
  const navigate = useNavigate();
  const [inventaris, setInventaris] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item_name: "",
    stock: 0,
    minimum_stock: 0,
  });
  const [editingItem, setEditingItem] = useState(null);

  const fetchInventaris = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot fetch inventaris.");
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:3001/api/inventaris?category=coffee shop",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
  const handleNewItemInputChange = (e) =>
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  const handleEditingItemInputChange = (e) =>
    setEditingItem({ ...editingItem, [e.target.name]: e.target.value });

  const handleCreateItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot create item.");
      return;
    }

    try {
      const newItemWithCategory = {
        ...newItem,
        category: "coffee shop", // Menambahkan kategori coffee shop
      };

      await axios.post(
        "http://localhost:3001/api/inventaris",
        newItemWithCategory,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      console.error(
        "Authentication token or editing item data not found. Cannot update item."
      );
      return;
    }
    try {
      await axios.put(
        `http://localhost:3001/api/inventaris/${editingItem.id}`,
        editingItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        <h2 className="manage-inventaris-title">
          Manajemen Inventaris Coffee Shop
        </h2>
        <Button
          variant="primary"
          onClick={handleCreateModal}
          className="action-button"
        >
          <FaPlus /> Tambah Item
        </Button>
      </header>

      {/* Card Layout for Inventaris */}
      <div className="inventaris-card-list">
        <Row xs={1} md={2} lg={3} className="g-4">
          {" "}
          {/* Responsive Grid */}
          {inventaris.length > 0 ? (
            inventaris.map((item) => (
              <Col key={item.id}>
                <Card className="inventaris-card">
                  {" "}
                  {/* Removed h-100 */}
                  <div className="card-image-placeholder">
                    {/* Placeholder for image */}
                    <FaInfoCircle
                      className="info-icon"
                      onClick={() => alert(`Info for ${item.item_name}`)}
                    />{" "}
                    {/* Basic info click handler */}
                  </div>
                  <Card.Body>
                    <Card.Title className="item-name">
                      {item.item_name}
                    </Card.Title>
                    <div className="item-details">
                      <p className="item-stock">
                        Stok Barang: {item.stock}
                        {item.stock <= item.minimum_stock && (
                          <span className="stock-warning-text">
                            {" "}
                            (Minimum!)
                          </span>
                        )}
                      </p>
                      <p className="item-min-stock">
                        Minimum Stok: {item.minimum_stock}
                      </p>
                    </div>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="edit-button"
                      onClick={() => handleEditClick(item)}
                      style={{
                        borderColor: "#00bcd4 !important",
                        color: "#00bcd4",
                        backgroundColor: "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontWeight: 500,
                        borderWidth: "2px",
                      }}
                    >
                      <FaEdit style={{ marginRight: "4px" }} />
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="delete-button"
                      onClick={() => handleDelete(item.id)}
                      style={{
                        borderColor: "#e53935 !important",
                        color: "#e53935",
                        backgroundColor: "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontWeight: 500,
                        marginLeft: "0.7rem",
                        borderWidth: "2px",
                      }}
                    >
                      <FaTrashAlt style={{ marginRight: "4px" }} />
                      Hapus
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-center w-100">Tidak ada data inventaris.</p>{" "}
              {/* Message if no data */}
            </Col>
          )}
        </Row>
      </div>

      {/* Modals remain the same */}
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stok</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={newItem.stock}
                onChange={handleNewItemInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Stock</Form.Label>
              <Form.Control
                type="number"
                name="minimum_stock"
                value={newItem.minimum_stock}
                onChange={handleNewItemInputChange}
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stok</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={editingItem?.stock || ""}
                onChange={handleEditingItemInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Minimum Stock</Form.Label>
              <Form.Control
                type="number"
                name="minimum_stock"
                value={editingItem?.minimum_stock || ""}
                onChange={handleEditingItemInputChange}
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

      <Footer />
    </div>
  );
};

export default ManageInventarisCoffeeShop;
