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

const API_URL = "http://localhost:3001/coffee-shop"; // Backend URL

function ManageCoffeeShopMenu({ theme }) { // Added theme prop
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false); // State for description modal
  const [currentDescriptionItem, setCurrentDescriptionItem] = useState(null); // State for item in description modal
  const cartIconRef = useRef(null); // Ref for the cart icon

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

  // Fetch menus on component mount
  useEffect(() => {
    fetchMenus();
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
    const token = getToken();
    if (!token) {
      setError("Authentication token not found.");
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
        setSuccess("Menu item updated successfully!");
      } else {
        response = await axios.post(`${API_URL}/menus`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Menu item created successfully!");
      }
      fetchMenus(); // Refresh the list
      handleCloseModal();
    } catch (err) {
      console.error("Error saving menu item:", err);
      setError(err.response?.data?.message || "Failed to save menu item.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");
    const token = getToken();
    if (!token) {
      setError("Authentication token not found.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.delete(`${API_URL}/menus/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Menu item deleted successfully!");
      fetchMenus(); // Refresh the list
    } catch (err) {
      console.error("Error deleting menu item:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete menu item. It might be used in existing orders."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`manage-coffee-menu-container ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <div className="manage-coffee-menu-header">
        <h2 className="manage-coffee-title">Manage Coffee Shop Menu</h2>
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

      <Button className="action-button mb-3" onClick={() => handleShowModal()}>
        <FontAwesomeIcon icon={faPlus} /> Tambah Menu Baru
      </Button>

      {isLoading && !menus.length ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="menu-cards-container">
          {menus.map((item, index) => (
            <div className="menu-card" key={item.id}>
              <FontAwesomeIcon
                icon={faEdit}
                className="edit-icon" // Class for styling
                onClick={() => handleShowModal(item)} // Reuses existing modal for editing
                title="Edit Menu Item"
              />
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="info-icon"
                onClick={() => handleShowDescriptionModal(item)}
                title="View Description"
              />
              <h5>{item.name}</h5>
              <p>Rp {parseFloat(item.price).toLocaleString("id-ID")}</p>
              <div className="menu-card-actions">
                {" "}
                {/* Wrapper for buttons */}
                <Button
                  className="btn btn-add-to-cart"
                  onClick={(e) => addToCart(item, e)}
                >
                  Tambah
                </Button>
                <Button
                  className="btn btn-delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
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
          </Button>
          <Button
            onClick={() => {
              if (cart.length === 0) {
                toast.warn("Keranjang masih kosong. Silahkan pilih menu!", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
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
      <ToastContainer />

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentItem ? "Edit Menu Item" : "Tambah Menu Baru"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formMenuName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter menu item name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formMenuPrice">
              <Form.Label>Price (Rp)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group controlId="formMenuCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Coffee, Non-Coffee, Snack"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formMenuDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="formMenuAvailability">
              <Form.Label>Availability</Form.Label>
              <Form.Control
                as="select"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                required
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </Form.Control>
            </Form.Group>

            <Button onClick={handleCloseModal} className="action-button mr-2">
              Cancel
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
                "Update Item"
              ) : (
                "Add Item"
              )}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ManageCoffeeShopMenu;
