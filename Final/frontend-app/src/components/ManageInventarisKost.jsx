import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Card, Row, Col } from "react-bootstrap";
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaArrowLeft,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./ManageInventarisKost.css";

const ManageInventarisKost = () => {
  const navigate = useNavigate();
  const [inventaris, setInventaris] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
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
        "http://localhost:3001/api/inventaris?category=kost",
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
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error(
        "Token autentikasi tidak ditemukan. Tidak dapat menghapus item."
      );
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/api/inventaris/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventaris(inventaris.filter((item) => item.id !== id));
      setShowDeleteModal(false);
      setDeleteItemId(null);
    } catch (error) {
      console.error("Error saat menghapus item:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
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
        category: "kost",
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
        <h2 className="manage-inventaris-title">Manajemen Inventaris Kost</h2>
        <Button
          variant="primary"
          onClick={handleCreateModal}
          className="action-button"
        >
          <FaPlus /> Tambah Item
        </Button>
      </header>

      <div className="inventaris-card-list">
        <Row xs={1} md={2} lg={3} className="g-4">
          {inventaris.length > 0 ? (
            inventaris.map((item) => (
              <Col key={item.id}>
                <Card className="inventaris-card">
                  <div className="card-image-placeholder">
                    <FaInfoCircle
                      className="info-icon"
                      onClick={() => alert(`Info for ${item.item_name}`)}
                    />
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
                      }}
                    >
                      <FaEdit style={{ marginRight: "4px" }} />
                      Edit
                    </Button>{" "}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="delete-button"
                      onClick={() => handleDeleteClick(item.id)}
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
              <p className="text-center w-100">Tidak ada data inventaris.</p>
            </Col>
          )}
        </Row>
      </div>

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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus item ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteItemId)}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default ManageInventarisKost;
