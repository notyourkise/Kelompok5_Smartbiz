import React, { useState } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './PaymentForm.css';

function PaymentForm() {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    const [paymentType, setPaymentType] = useState('Tunai'); // Default to Tunai
    // Assuming cart data is passed somehow, e.g., via local storage or props
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const handleBack = () => {
        navigate('/manage-coffee-shop-menu'); // Navigate back to the menu page
    };

    const handlePayNow = () => {
        // Store customer name and payment type in local storage
        localStorage.setItem('customerName', customerName);
        localStorage.setItem('paymentType', paymentType);

        // Implement payment processing logic here
        // For now, just show an alert
        alert('Payment processed!');
        // Navigate to the receipt page and pass cart data as state
        navigate('/receipt', { state: { cart, customerName, paymentType } });
        // Clear cart after navigating
        localStorage.removeItem('cart');
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="payment-form-container">
            <h2>Payment Details</h2>
            <Form>
                <Form.Group controlId="customerName" className="mb-3">
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="paymentType" className="mb-3">
                    <Form.Label>Payment Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                    >
                        <option value="Tunai">Tunai</option>
                        <option value="Qris">Qris</option>
                    </Form.Control>
                </Form.Group>
            </Form>


            <h3>Order Details</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>Rp {parseFloat(item.price * item.quantity).toLocaleString('id-ID')}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <h4>Total: Rp {calculateTotal().toLocaleString('id-ID')}</h4>

            <div className="button-container">
                <Button className="back-button" onClick={handleBack}>
                    Back
                </Button>
                <Button className="pay-now-button" onClick={handlePayNow}>
                    Pay Now
                </Button>
            </div>
        </div>
    );
}

export default PaymentForm;
