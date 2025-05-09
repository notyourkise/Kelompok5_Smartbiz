import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap'; // Added Alert
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCreditCard, faShoppingCart, faArrowLeft, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'; // Added faSpinner
import axios from 'axios'; // Import axios
import './PaymentForm.css'; 

function PaymentForm() {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false); // State for loading indicator
    const [paymentError, setPaymentError] = useState(''); // State for payment error messages
    const [customerName, setCustomerName] = useState('');
    const [paymentType, setPaymentType] = useState('Tunai'); // Default to Tunai
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const handleBackToMenu = () => {
        navigate('/manage-coffee-shop-menu');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handlePayNow = async () => {
        setPaymentError(''); // Clear previous errors
        if (!customerName.trim()) {
            setPaymentError('Nama pelanggan harus diisi.');
            return;
        }
        if (cart.length === 0) {
            setPaymentError('Keranjang belanja kosong.');
            return;
        }

        setIsProcessing(true);
        const token = localStorage.getItem("token");
        if (!token) {
            setPaymentError("Autentikasi gagal. Silakan login kembali.");
            setIsProcessing(false);
            return;
        }

        const totalAmount = calculateTotal();
        const itemsDescription = cart.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ');
        const transactionDescription = `Penjualan Kopi - ${customerName}: ${itemsDescription}`;

        const transactionData = {
            type: "income",
            amount: totalAmount,
            description: transactionDescription,
            category: "Coffee Shop", // Ensure this matches the category used in ManageCoffeeShopFinance
            payment_method: paymentType,
        };

        try {
            const response = await axios.post(
                "http://localhost:3001/keuangan/detail",
                transactionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 201 || response.status === 200) { // Check for successful creation
                // Store customer name and payment type for receipt
                localStorage.setItem('customerName', customerName);
                localStorage.setItem('paymentType', paymentType);
                
                navigate('/receipt', { state: { cart, customerName, paymentType } });
                localStorage.removeItem('cart'); // Clear cart after successful navigation and transaction
            } else {
                // Handle non-201/200 success statuses if backend returns them for specific cases
                const errorData = response.data || { message: `Gagal mencatat transaksi. Status: ${response.status}` };
                setPaymentError(errorData.message || 'Terjadi kesalahan saat mencatat transaksi.');
            }
        } catch (error) {
            console.error("Error creating transaction:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setPaymentError(`Gagal: ${error.response.data.message}`);
            } else {
                setPaymentError("Gagal terhubung ke server atau terjadi kesalahan tidak dikenal.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="payment-form-elegant-container">
            <Container fluid="lg" className="py-4">
                <Button variant="link" onClick={handleBackToMenu} className="back-link-button mb-3 ps-0">
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back to Menu
                </Button>

                <Card className="payment-card shadow-lg">
                    <Card.Header as="h2" className="text-center payment-card-header">
                        <FontAwesomeIcon icon={faShoppingCart} className="me-2" /> Checkout
                    </Card.Header>
                    <Card.Body className="p-4">
                        {paymentError && <Alert variant="danger" onClose={() => setPaymentError('')} dismissible>{paymentError}</Alert>}
                        <Row>
                            <Col md={6} className="mb-4 mb-md-0 customer-payment-section">
                                <h4 className="section-title mb-3">
                                    <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                                    Customer & Payment Information
                                </h4>
                                <Form>
                                    <Form.Group controlId="customerName" className="mb-4 form-group-elegant">
                                        <Form.Label>Customer Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter customer name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            required
                                            className="form-control-elegant"
                                            isInvalid={!!paymentError && !customerName.trim()}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Nama pelanggan tidak boleh kosong.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    <Form.Group controlId="paymentType" className="mb-3 form-group-elegant">
                                        <Form.Label>
                                            <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                                            Payment Type
                                        </Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={paymentType}
                                            onChange={(e) => setPaymentType(e.target.value)}
                                            className="form-control-elegant"
                                        >
                                            <option value="Tunai">Tunai (Cash)</option>
                                            <option value="Qris">Qris</option>
                                            {/* Add other payment methods if needed */}
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                            </Col>

                            <Col md={6} className="order-summary-section">
                                <h4 className="section-title mb-3">Order Summary</h4>
                                <div className="order-summary-box p-3">
                                    {cart.length > 0 ? (
                                        <Table responsive hover className="order-table-elegant">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Item</th>
                                                    <th className="text-center">Qty</th>
                                                    <th className="text-end">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td className="text-center">{item.quantity}</td>
                                                        <td className="text-end">Rp {parseFloat(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p className="text-center text-muted">Your cart is empty.</p>
                                    )}
                                    {cart.length > 0 && (
                                        <div className="total-section text-end mt-3 pt-3 border-top">
                                            <h5 className="total-amount fw-bold">Total: Rp {calculateTotal().toLocaleString('id-ID')}</h5>
                                        </div>
                                    )}
                                </div>
                            </Col>
                        </Row>

                        <div className="text-center mt-4 pt-4 border-top payment-actions">
                            <Button variant="outline-secondary" onClick={handleBackToMenu} className="me-sm-3 mb-2 mb-sm-0 action-button-elegant back-button-elegant">
                                <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Cancel
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handlePayNow} 
                                className="action-button-elegant pay-now-button-elegant"
                                disabled={isProcessing || cart.length === 0 || !customerName.trim()}
                            >
                                {isProcessing ? (
                                    <><FontAwesomeIcon icon={faSpinner} spin className="me-2" /> Processing...</>
                                ) : (
                                    <><FontAwesomeIcon icon={faCheckCircle} className="me-2" /> Pay Now</>
                                )}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default PaymentForm;
