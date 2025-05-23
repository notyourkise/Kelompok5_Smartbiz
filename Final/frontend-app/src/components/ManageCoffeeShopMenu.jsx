import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Alert, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faPlus,
  faArrowLeft,
  faInfoCircle,
  faEdit,
} from "@fortawesome/free-solid-svg-icons"; // Added faEdit and faInfoCircle
import "./ManageCoffeeShopMenu.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode as a named import

const API_URL = "http://localhost:3001/coffee-shop"; // Backend URL

function ManageCoffeeShopMenu({ theme }) {
  // Added theme prop
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [userRole, setUserRole] = useState(null); // State to store user role
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false); // State for description modal
  const [currentDescriptionItem, setCurrentDescriptionItem] = useState(null); // State for item in description modal
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const cartIconRef = useRef(null); // Ref for the cart icon

  // Toast notification utility functions
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: theme === "dark" ? "dark" : "light",
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: theme === "dark" ? "dark" : "light",
    });
  };

  const increaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update local storage
  };

  const decreaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) }
        : cartItem
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update local storage
  };

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    availability: "available",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch menus and decode token on component mount
  useEffect(() => {
    fetchMenus();
    const token = getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role); // Assuming the role is stored in the 'role' claim
        console.log("User Role:", decodedToken.role); // Log the user role
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole(null); // Set role to null if decoding fails
        console.log("User Role: null (decoding failed)"); // Log null role
      }
    } else {
      setUserRole(null); // Set role to null if no token is found
      console.log("User Role: null (no token)"); // Log null role
    }
  }, []);

  const getToken = () => localStorage.getItem("token");

  const fetchMenus = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }
      const response = await axios.get(`${API_URL}/menus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMenus(response.data);
    } catch (err) {
      console.error("Error fetching menus:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch menus. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDescriptionModal = (item) => {
    setCurrentDescriptionItem(item);
    setShowDescriptionModal(true);
  };

  const handleCloseDescriptionModal = () => {
    setShowDescriptionModal(false);
    setCurrentDescriptionItem(null);
  };

  const addToCart = (menuItem, event) => {
    let updatedCart;
    const existingItemIndex = cart.findIndex((item) => item.id === menuItem.id);

    if (existingItemIndex > -1) {
      updatedCart = cart.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...menuItem, quantity: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Animation logic
    if (event && cartIconRef.current) {
      const sourceElement = event.currentTarget; // The button that was clicked
      const cartElement = cartIconRef.current;

      const sourceRect = sourceElement.getBoundingClientRect();
      const cartRect = cartElement.getBoundingClientRect();

      const flyingEl = document.createElement("div");
      flyingEl.classList.add("flying-item");
      flyingEl.textContent = menuItem.name; // Set text to menu item name
      document.body.appendChild(flyingEl);

      // Get dimensions of the flying element AFTER it has content and is in the DOM
      const flyingElRect = flyingEl.getBoundingClientRect();

      // Initial position (center of the source button, adjusted by half of flyingEl's actual size)
      const initialLeft =
        sourceRect.left + sourceRect.width / 2 - flyingElRect.width / 2;
      const initialTop =
        sourceRect.top + sourceRect.height / 2 - flyingElRect.height / 2;

      flyingEl.style.left = `${initialLeft}px`;
      flyingEl.style.top = `${initialTop}px`;
      flyingEl.style.opacity = "1"; // Make it visible

      // Force a reflow to apply initial styles before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Target position (center of the cart icon, adjusted by half of flyingEl's scaled size)
          // The scale is 0.2, so the final visual size will be flyingElRect.width * 0.2
          const targetCenterX = cartRect.left + cartRect.width / 2;
          const targetCenterY = cartRect.top + cartRect.height / 2;

          const finalFlyingElWidth = flyingElRect.width * 0.2;
          const finalFlyingElHeight = flyingElRect.height * 0.2;

          const targetVisualLeft = targetCenterX - finalFlyingElWidth / 2;
          const targetVisualTop = targetCenterY - finalFlyingElHeight / 2;

          const deltaX = targetVisualLeft - initialLeft;
          const deltaY = targetVisualTop - initialTop;

          flyingEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
          flyingEl.style.opacity = "0";
        });
      });

      setTimeout(() => {
        if (flyingEl.parentNode) {
          flyingEl.parentNode.removeChild(flyingEl);
        }
      }, 500); // Should match CSS transition duration
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleShowModal = (item = null) => {
    setError("");
    setSuccess("");
    if (item) {
      setCurrentItem(item);
      setFormData({
        name: item.name,
        price: item.price,
        category: item.category || "",
        description: item.description || "",
        availability: item.availability || "available",
      });
    } else {
      setCurrentItem(null);
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
        availability: "available",
      });
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem(null);
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      availability: "available",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate form data
    if (!formData.name || !formData.price || !formData.category) {
      setError("Nama menu, harga, dan kategori harus diisi!");
      showErrorToast("Nama menu, harga, dan kategori harus diisi!");
      setIsLoading(false);
      return;
    }

    // Validate price is a positive number
    if (parseFloat(formData.price) <= 0) {
      setError("Harga harus lebih dari 0!");
      showErrorToast("Harga harus lebih dari 0!");
      setIsLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setError("Authentication token not found.");
      showErrorToast("Authentication token not found. Silahkan login kembali.");
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      price: parseFloat(formData.price), // Ensure price is a number
    };

    try {
      let response;
      if (currentItem) {
        response = await axios.put(
          `${API_URL}/menus/${currentItem.id}`,
          dataToSend,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const successMsg = "Menu berhasil diperbarui!";
        setSuccess(successMsg);
        showSuccessToast(successMsg);
      } else {
        response = await axios.post(`${API_URL}/menus`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const successMsg = "Menu baru berhasil ditambahkan!";
        setSuccess(successMsg);
        showSuccessToast(successMsg);
      }
      fetchMenus(); // Refresh the list
      setTimeout(() => {
        handleCloseModal(); // Close modal after showing toast notification
      }, 500);
    } catch (err) {
      console.error("Error saving menu item:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Gagal menyimpan menu. Silahkan coba lagi.";
      setError(errorMsg);
      showErrorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle showing delete confirmation modal
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirmModal(true);
  };
  // Handle deleting item after confirmation
  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    const token = getToken();
    if (!token || !itemToDelete) {
      const errorMsg = "Authentication token or item to delete not found.";
      setError(errorMsg);
      showErrorToast(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      await axios.delete(`${API_URL}/menus/${itemToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const successMsg = `Menu ${itemToDelete.name} berhasil dihapus!`;
      setSuccess(successMsg);
      showSuccessToast(successMsg);
      fetchMenus(); // Refresh the list
      setShowDeleteConfirmModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Error deleting menu item:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Gagal menghapus menu. Menu mungkin sedang digunakan dalam pesanan.";
      setError(errorMsg);
      showErrorToast(errorMsg);
      setShowDeleteConfirmModal(false);
      setItemToDelete(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`manage-coffee-menu-container ${
        theme === "dark" ? "theme-dark" : "theme-light"
      }`}
    >
      <div className="manage-coffee-menu-header">
        <h2 className="manage-coffee-title">Manajemen Menu Coffee Shop</h2>
        <div className="cart-container">
          <FontAwesomeIcon
            ref={cartIconRef}
            icon={faShoppingCart}
            className="cart-icon"
            onClick={() => setShowCartModal(true)}
          />
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {userRole === "superadmin" && ( // Conditionally render "Tambah Menu Baru" button
        <Button
          className="action-button mb-4"
          onClick={() => handleShowModal()}
        >
          <FontAwesomeIcon icon={faPlus} /> Tambah Menu Baru
        </Button>
      )}

      {isLoading && !menus.length ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div>
          {/* Coffee Section */}
          <div className="menu-section mb-5">
            <h3 className="section-title">Coffee</h3>
            <div className="menu-cards-container">
              {menus
                .filter((item) => item.category === "coffee")
                .map((item) => (
                  <div className="menu-card" key={item.id}>
                    {userRole === "superadmin" && ( // Conditionally render edit icon
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="edit-icon"
                        onClick={() => handleShowModal(item)}
                        title="Edit Menu"
                      />
                    )}
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                      onClick={() => handleShowDescriptionModal(item)}
                      title="Lihat Deskripsi"
                    />
                    <h5>{item.name}</h5>
                    <p>Rp {parseFloat(item.price).toLocaleString("id-ID")}</p>
                    <div className="menu-card-actions">
                      <Button
                        className="btn btn-add-to-cart"
                        onClick={(e) => addToCart(item, e)}
                      >
                        Tambah
                      </Button>
                      {userRole === "superadmin" && ( // Conditionally render delete button
                        <Button
                          className="btn btn-delete"
                          onClick={() => handleDeleteClick(item)}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Non-Coffee Section */}
          <div className="menu-section mb-5">
            <h3 className="section-title">Non-Coffee</h3>
            <div className="menu-cards-container">
              {menus
                .filter((item) => item.category === "non-coffee")
                .map((item) => (
                  <div className="menu-card" key={item.id}>
                    {userRole === "superadmin" && ( // Conditionally render edit icon
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="edit-icon"
                        onClick={() => handleShowModal(item)}
                        title="Edit Menu"
                      />
                    )}
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                      onClick={() => handleShowDescriptionModal(item)}
                      title="Lihat Deskripsi"
                    />
                    <h5>{item.name}</h5>
                    <p>Rp {parseFloat(item.price).toLocaleString("id-ID")}</p>
                    <div className="menu-card-actions">
                      <Button
                        className="btn btn-add-to-cart"
                        onClick={(e) => addToCart(item, e)}
                      >
                        Tambah
                      </Button>
                      {userRole === "superadmin" && ( // Conditionally render delete button
                        <Button
                          className="btn btn-delete"
                          onClick={() => handleDeleteClick(item)}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Snack Section */}
          <div className="menu-section">
            <h3 className="section-title">Snack</h3>
            <div className="menu-cards-container">
              {menus
                .filter((item) => item.category === "snack")
                .map((item) => (
                  <div className="menu-card" key={item.id}>
                    {userRole === "superadmin" && ( // Conditionally render edit icon
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="edit-icon"
                        onClick={() => handleShowModal(item)}
                        title="Edit Menu"
                      />
                    )}
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="info-icon"
                      onClick={() => handleShowDescriptionModal(item)}
                      title="Lihat Deskripsi"
                    />
                    <h5>{item.name}</h5>
                    <p>Rp {parseFloat(item.price).toLocaleString("id-ID")}</p>
                    <div className="menu-card-actions">
                      <Button
                        className="btn btn-add-to-cart"
                        onClick={(e) => addToCart(item, e)}
                      >
                        Tambah
                      </Button>
                      {userRole === "superadmin" && ( // Conditionally render delete button
                        <Button
                          className="btn btn-delete"
                          onClick={() => handleDeleteClick(item)}
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Description Modal */}
      {currentDescriptionItem && (
        <Modal
          show={showDescriptionModal}
          onHide={handleCloseDescriptionModal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{currentDescriptionItem.name} - Deskripsi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {currentDescriptionItem.description ||
                "Tidak ada deskripsi untuk item ini."}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseDescriptionModal}
              className="action-button"
            >
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Keranjang Popup */}
      <Modal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        centered
        className="cart-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Keranjang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama Menu</th>
                <th>Jumlah</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    Rp{" "}
                    {parseFloat(item.price * item.quantity).toLocaleString(
                      "id-ID"
                    )}
                  </td>
                  <td className="quantity-buttons">
                    <Button size="sm" onClick={() => decreaseQuantity(item)}>
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button size="sm" onClick={() => increaseQuantity(item)}>
                      +
                    </Button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="3">Total</td>
                <td>
                  Rp{" "}
                  {cart
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toLocaleString("id-ID")}
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setCart([])} className="action-button">
            Kosongkan Keranjang
          </Button>{" "}
          <Button
            onClick={() => {
              if (cart.length === 0) {
                showErrorToast("Keranjang masih kosong. Silahkan pilih menu!");
                return;
              }
              localStorage.setItem("cart", JSON.stringify(cart));
              navigate("/payment-form");
            }}
            className="action-button"
          >
            Lanjut
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme === "dark" ? "dark" : "light"}
      />

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentItem ? "Edit Menu" : "Tambah Menu Baru"}
          </Modal.Title>{" "}
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formMenuName">
              <Form.Label>Nama Menu</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama menu"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formMenuPrice">
              <Form.Label>Harga (Rp)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Masukkan harga"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group controlId="formMenuCategory">
              <Form.Label>Kategori</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="coffee">Coffee</option>
                <option value="non-coffee">Non-Coffee</option>
                <option value="snack">Snack</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formMenuDescription">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Masukkan deskripsi menu"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </Form.Group>

            <Form.Group controlId="formMenuAvailability">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
              >
                <option value="available">Tersedia</option>
                <option value="unavailable">Tidak Tersedia</option>
              </Form.Control>
            </Form.Group>

            <Button onClick={handleCloseModal} className="action-button mr-2">
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="action-button"
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : currentItem ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Menu"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmModal}
        onHide={() => setShowDeleteConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus Menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus menu "{itemToDelete?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageCoffeeShopMenu;
