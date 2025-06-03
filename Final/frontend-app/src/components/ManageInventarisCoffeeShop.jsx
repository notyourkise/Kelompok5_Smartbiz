import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaArrowLeft,
  FaInfoCircle,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./ManageInventarisCoffeeShop.css";
import "./SuccessModal.css";

const ManageInventarisCoffeeShop = () => {
  const navigate = useNavigate();
  const [inventaris, setInventaris] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [newItem, setNewItem] = useState({
    item_name: "",
    stock: 0,
    minimum_stock: 0,
    image: null,
    expiration_date: "",
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

      // Show success message
      setSuccessMessage("Item inventaris coffee shop berhasil dihapus!");
      setShowSuccessModal(true);

      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error("Error saat menghapus item:", error);
      // Optionally show an error modal or message here
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

  // Function to validate image file format
  const validateImageFormat = (file) => {
    // List of allowed image formats
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (file && !allowedTypes.includes(file.type)) {
      setValidationError(
        `Format file tidak valid. Format yang diizinkan: JPG, JPEG, PNG, GIF, WEBP.`
      );
      return false;
    }
    setValidationError(""); // Clear error if format is valid
    return true;
  };

  const handleCreateModal = () => {
    setValidationError("");
    setShowCreateModal(true);
  };
  const handleNewItemInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      if (files[0] && validateImageFormat(files[0])) {
        setNewItem({ ...newItem, [name]: files[0] });
      } else if (files[0]) {
        // If validation failed, reset the file input
        e.target.value = null;
      }
    } else {
      setNewItem({ ...newItem, [name]: value });
    }
  };

  const handleEditingItemInputChange = (e) => {
    const { name, value, files } = e.target; // files is a FileList
    if (name === "image") {
      const file = files && files.length > 0 ? files[0] : null;

      if (file) {
        // Berkas dipilih dari dialog
        if (validateImageFormat(file)) {
          // Berkas baru yang valid dipilih, siapkan untuk diunggah
          setEditingItem((prev) => ({ ...prev, image: file }));
        } else {
          // Berkas yang dipilih tidak valid.
          // validateImageFormat sudah mengatur pesan kesalahan.
          // Kosongkan input dan pastikan tidak ada berkas baru (yang tidak valid) yang disiapkan.
          setEditingItem((prev) => ({ ...prev, image: null })); // Atur secara eksplisit ke null
          if (e.target) e.target.value = null; // Reset input file secara visual
        }
      } else {
        // Tidak ada berkas yang dipilih (misalnya, dialog dibatalkan, atau input dikosongkan)
        // Ini berarti pengguna ingin kembali ke "tidak ada gambar baru" atau belum memilih.
        // Pastikan tidak ada berkas baru yang disiapkan.
        setEditingItem((prev) => ({ ...prev, image: null })); // Atur secara eksplisit ke null
        // Coba kosongkan input secara visual jika perlu, meskipun `files` yang kosong sering berarti sudah kosong secara visual.
        if (e.target) e.target.value = null;
      }
    } else {
      // Tangani jenis input lainnya
      setEditingItem((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateItem = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot create item.");
      return;
    }

    // Validasi semua field required telah diisi
    if (
      !newItem.item_name ||
      !newItem.stock ||
      !newItem.minimum_stock ||
      !newItem.image ||
      !newItem.expiration_date
    ) {
      setValidationError(
        "Mohon isi semua kolom yang ditandai dengan tanda bintang (*) untuk menambahkan item."
      );
      return;
    }

    // Validate stock and minimum_stock
    if (parseInt(newItem.stock, 10) < 1) {
      setValidationError("Stok tidak boleh kurang dari 1.");
      return;
    }
    if (parseInt(newItem.minimum_stock, 10) < 1) {
      setValidationError("Minimum Stok tidak boleh kurang dari 1.");
      return;
    }

    // Reset error message if validation passes
    setValidationError("");

    // Validate image format
    if (!validateImageFormat(newItem.image)) {
      return;
    }

    const formData = new FormData();
    formData.append("item_name", newItem.item_name);
    formData.append("stock", newItem.stock);
    formData.append("minimum_stock", newItem.minimum_stock);
    formData.append("category", "coffee shop");
    if (newItem.image) {
      formData.append("image", newItem.image);
    }
    if (newItem.expiration_date) {
      formData.append("expiration_date", newItem.expiration_date);
    }

    try {
      await axios.post("http://localhost:3001/api/inventaris", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setShowCreateModal(false);
      setSuccessMessage("Item inventaris coffee shop berhasil ditambahkan!");
      setShowSuccessModal(true);

      // Reset form
      setNewItem({
        item_name: "",
        stock: 0,
        minimum_stock: 0,
        image: null,
        expiration_date: "",
      });

      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        fetchInventaris();
      }, 2000);
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };
  const handleEditClick = (item) => {
    setValidationError("");
    let formattedExpirationDate = "";
    if (item.expiration_date) {
      try {
        const date = new Date(item.expiration_date);
        if (!isNaN(date.getTime())) {
          formattedExpirationDate = date.toISOString().split("T")[0];
        } else {
          console.warn(
            "Invalid expiration_date from backend:",
            item.expiration_date
          );
          formattedExpirationDate = ""; // Or handle as per backend expectation
        }
      } catch (e) {
        console.error("Error formatting expiration date:", e);
        formattedExpirationDate = item.expiration_date; // Fallback
      }
    }

    setEditingItem({
      ...item, // Includes id, item_name, stock, minimum_stock, image_url, category
      expiration_date: formattedExpirationDate,
      image: null, // This field will hold the new File object if a new image is selected
    });
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

    // Validasi semua field required telah diisi
    if (
      !editingItem.item_name ||
      !editingItem.stock ||
      !editingItem.minimum_stock ||
      !editingItem.expiration_date
    ) {
      setValidationError(
        "Mohon isi semua kolom yang ditandai dengan tanda bintang (*) untuk memperbarui item."
      );
      return;
    }

    // Validate stock and minimum_stock
    if (parseInt(editingItem.stock, 10) < 1) {
      setValidationError("Stok tidak boleh kurang dari 1.");
      return;
    }
    if (parseInt(editingItem.minimum_stock, 10) < 1) {
      setValidationError("Minimum Stok tidak boleh kurang dari 1.");
      return;
    }

    // Reset error message if validation passes
    setValidationError("");

    // Validate image format
    if (
      editingItem.image instanceof File &&
      !validateImageFormat(editingItem.image)
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("item_name", editingItem.item_name);
    formData.append("stock", editingItem.stock);
    formData.append("minimum_stock", editingItem.minimum_stock);
    formData.append("category", "coffee shop");
    if (editingItem.image instanceof File) {
      formData.append("image", editingItem.image);
    }
    if (editingItem.expiration_date) {
      formData.append("expiration_date", editingItem.expiration_date);
    }

    try {
      await axios.put(
        `http://localhost:3001/api/inventaris/${editingItem.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowEditModal(false);
      setSuccessMessage("Item inventaris coffee shop berhasil diperbarui!");
      setShowSuccessModal(true);
      setEditingItem(null);

      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        fetchInventaris();
      }, 2000);
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
        {inventaris.length > 0 ? (
          <>
            {inventaris.map((item) => (
              <div className="menu-card" key={item.id}>
                {item.image_url && (
                  <img
                    src={`http://localhost:3001/${item.image_url}`}
                    alt={item.item_name}
                    className="card-image"
                  />
                )}
                <FaInfoCircle
                  className="info-icon"
                  onClick={() => alert(`Info for ${item.item_name}`)}
                />
                <h5>{item.item_name}</h5>
                <div className="item-details">
                  <p className="item-stock">
                    Stok Barang: {item.stock}
                    {item.stock <= item.minimum_stock && (
                      <span className="stock-warning-text"> (Minimum!)</span>
                    )}
                  </p>
                  <p className="item-min-stock">
                    Minimum Stok: {item.minimum_stock}
                  </p>
                  {item.expiration_date && (
                    <p
                      className={`item-expiration ${
                        new Date(item.expiration_date) < new Date()
                          ? "expired"
                          : "valid"
                      }`}
                    >
                      {new Date(item.expiration_date) < new Date()
                        ? "Expired"
                        : `Valid Until: ${new Date(
                            item.expiration_date
                          ).toLocaleDateString()}`}
                    </p>
                  )}
                </div>
                <div className="menu-card-actions">
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
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-center w-100">Tidak ada data inventaris.</p>
        )}
      </div>
      {/* Modals remain the same */}{" "}
      <Modal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setValidationError("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tambah Item Inventaris</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validationError && (
            <Alert
              variant="danger"
              onClose={() => setValidationError("")}
              dismissible
            >
              {validationError}
            </Alert>
          )}
          <p style={{ color: "white" }}>Kolom dengan tanda * wajib diisi</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Nama Item <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="item_name"
                value={newItem.item_name}
                onChange={handleNewItemInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Stok <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={newItem.stock}
                onChange={handleNewItemInputChange}
                min="1"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Minimum Stock <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="minimum_stock"
                value={newItem.minimum_stock}
                onChange={handleNewItemInputChange}
                min="1"
                required
              />
            </Form.Group>{" "}
            <Form.Group className="mb-3">
              <Form.Label>
                Gambar Produk <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
                onChange={handleNewItemInputChange}
                required
              />
              <small className="text-muted">
                Format yang diizinkan: JPG, JPEG, PNG, GIF, dan WEBP.
              </small>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Tanggal Kadaluarsa <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="expiration_date"
                value={newItem.expiration_date}
                onChange={handleNewItemInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {" "}
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreateModal(false);
              setValidationError("");
            }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleCreateItem}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>{" "}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setValidationError("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Item Inventaris</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validationError && (
            <Alert
              variant="danger"
              onClose={() => setValidationError("")}
              dismissible
            >
              {validationError}
            </Alert>
          )}
          <p style={{ color: "white" }}>Kolom dengan tanda * wajib diisi</p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Nama Item <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="item_name"
                value={editingItem?.item_name || ""}
                onChange={handleEditingItemInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Stok <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={editingItem?.stock || ""}
                onChange={handleEditingItemInputChange}
                min="1"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Minimum Stock <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="minimum_stock"
                value={editingItem?.minimum_stock || ""}
                onChange={handleEditingItemInputChange}
                min="1"
                required
              />
            </Form.Group>{" "}
            <Form.Group className="mb-3">
              <Form.Label>Gambar Produk</Form.Label>
              {editingItem && editingItem.image_url && (
                <div className="mb-2">
                  <img
                    src={`http://localhost:3001/${editingItem.image_url}`}
                    alt="Current item"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  />
                  <small className="text-muted d-block mb-1">
                    Gambar saat ini. Unggah gambar baru di bawah untuk
                    menggantinya.
                  </small>
                </div>
              )}
              <Form.Control
                type="file"
                name="image"
                accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
                onChange={handleEditingItemInputChange}
              />
              <Form.Text className="text-muted">
                Format yang diterima: JPG, JPEG, PNG, GIF, WEBP. Ukuran maksimal
                2MB.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Tanggal Kadaluarsa <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="expiration_date"
                value={editingItem?.expiration_date || ""}
                onChange={handleEditingItemInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {" "}
          <Button
            variant="secondary"
            onClick={() => {
              setShowEditModal(false);
              setValidationError("");
            }}
          >
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
      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        className="success-modal"
      >
        <Modal.Body className="text-center p-4">
          <div className="success-checkmark-container">
            <FaCheckCircle className="success-checkmark-icon" />
          </div>
          <h4 className="mt-3">{successMessage}</h4>{" "}
        </Modal.Body>
      </Modal>
      {/* Footer dihapus karena sudah dihandle oleh Dashboard */}
    </div>
  );
};

export default ManageInventarisCoffeeShop;
