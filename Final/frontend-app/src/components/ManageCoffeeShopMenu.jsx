import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './ManageCoffeeShopMenu.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:3001/coffee-shop'; // Backend URL

function ManageCoffeeShopMenu() {
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const increaseQuantity = (item) => {
        const updatedCart = cart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
    };

    const decreaseQuantity = (item) => {
        const updatedCart = cart.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: Math.max(1, cartItem.quantity - 1) } : cartItem
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
    };

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        availability: 'available',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch menus on component mount
    useEffect(() => {
        fetchMenus();
    }, []);

    const getToken = () => localStorage.getItem('token');

    const fetchMenus = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = getToken();
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setIsLoading(false);
                return;
            }
            const response = await axios.get(`${API_URL}/menus`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMenus(response.data);
        } catch (err) {
            console.error('Error fetching menus:', err);
            setError(err.response?.data?.message || 'Failed to fetch menus. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = (menuItem) => {
        const existingItem = cart.find(item => item.id === menuItem.id);
        if (existingItem) {
            existingItem.quantity += 1;
            setCart([...cart]);
        } else {
            setCart([...cart, { ...menuItem, quantity: 1 }]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleShowModal = (item = null) => {
        setError('');
        setSuccess('');
        if (item) {
            setCurrentItem(item);
            setFormData({
                name: item.name,
                price: item.price,
                category: item.category || '',
                description: item.description || '',
                availability: item.availability || 'available',
            });
        } else {
            setCurrentItem(null);
            setFormData({
                name: '',
                price: '',
                category: '',
                description: '',
                availability: 'available',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentItem(null);
        setFormData({ name: '', price: '', category: '', description: '', availability: 'available' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        const token = getToken();
        if (!token) {
            setError('Authentication token not found.');
            setIsLoading(false);
            return;
        }

        const dataToSend = {
            ...formData,
            price: parseFloat(formData.price) // Ensure price is a number
        };

        try {
            let response;
            if (currentItem) {
                response = await axios.put(`${API_URL}/menus/${currentItem.id}`, dataToSend, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Menu item updated successfully!');
            } else {
                response = await axios.post(`${API_URL}/menus`, dataToSend, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Menu item created successfully!');
            }
            fetchMenus(); // Refresh the list
            handleCloseModal();
        } catch (err) {
            console.error('Error saving menu item:', err);
            setError(err.response?.data?.message || 'Failed to save menu item.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) {
            return;
        }
        setIsLoading(true);
        setError('');
        setSuccess('');
        const token = getToken();
        if (!token) {
            setError('Authentication token not found.');
            setIsLoading(false);
            return;
        }

        try {
            await axios.delete(`${API_URL}/menus/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Menu item deleted successfully!');
            fetchMenus(); // Refresh the list
        } catch (err) {
            console.error('Error deleting menu item:', err);
            setError(err.response?.data?.message || 'Failed to delete menu item. It might be used in existing orders.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="manage-coffee-menu-container">
            <div className="manage-coffee-menu-header">
                <Button className="back-button" onClick={() => navigate('/dashboard')}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <h2 className="manage-coffee-title">Manage Coffee Shop Menu</h2>
                <div className="cart-container">
                    <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" onClick={() => setShowCartModal(true)} />
                    {cart.length > 0 && (
                        <span className="cart-badge">{cart.length}</span>
                    )}
                </div>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Button className="action-button mb-3" onClick={() => handleShowModal()}>
                <FontAwesomeIcon icon={faPlus} /> Tambah Menu Baru
            </Button>

            {isLoading && !menus.length ? (
                <div className="text-center"><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></div>
            ) : (
                <div className="menu-cards-container">
                    {menus.map((item, index) => (
                        <div className="menu-card" key={item.id}>
                            <h5>{item.name}</h5>
                            <p>Rp {parseFloat(item.price).toLocaleString('id-ID')}</p>
                            <Button className="action-button mr-2" onClick={() => addToCart(item)}>Tambah</Button>
                            <Button className="action-button delete-button" onClick={() => handleDelete(item.id)}>Hapus</Button>
                        </div>
                    ))}
                </div>
            )}

            {/* Keranjang Popup */}
            <Modal show={showCartModal} onHide={() => setShowCartModal(false)} centered className="cart-modal">
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
                            <td>Rp {parseFloat(item.price * item.quantity).toLocaleString('id-ID')}</td>
                            <td className="quantity-buttons">
                                <Button size="sm" onClick={() => decreaseQuantity(item)}>-</Button>
                                <span>{item.quantity}</span>
                                <Button size="sm" onClick={() => increaseQuantity(item)}>+</Button>
                            </td>
                        </tr>
                            ))}
                            <tr>
                                <td colSpan="3">Total</td>
                            <td>Rp {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString('id-ID')}</td>
                            <td></td>
                        </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setCart([])} className="action-button">Kosongkan Keranjang</Button>
                    <Button onClick={() => {
                        if (cart.length === 0) {
                            toast.warn('Keranjang masih kosong. Silahkan pilih menu!', {
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
                        localStorage.setItem('cart', JSON.stringify(cart));
                        navigate('/payment-form');
                    }} className="action-button">Lanjut</Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer />

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{currentItem ? 'Edit Menu Item' : 'Tambah Menu Baru'}</Modal.Title>
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
                        <Button type="submit" disabled={isLoading} className="action-button">
                            {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : (currentItem ? 'Update Item' : 'Add Item')}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ManageCoffeeShopMenu;
