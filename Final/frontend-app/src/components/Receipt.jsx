import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle, faPrint, faArrowLeft, faStoreAlt, faMapMarkerAlt, 
    faReceipt, faCalendarAlt, faUser, faMoneyBillWave 
} from '@fortawesome/free-solid-svg-icons';
import './Receipt.css';

function Receipt() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, customerName, paymentType } = location.state || { cart: [], customerName: 'Customer', paymentType: 'Tunai' };
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(true);

    useEffect(() => {
        // Hide animation after a few seconds
        const timer = setTimeout(() => {
            setShowSuccessAnimation(false);
        }, 2500); // Animation visible for 2.5 seconds
        return () => clearTimeout(timer);
    }, []);

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handlePrint = () => {
        window.print();
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Generate a simple pseudo-random transaction ID for display
    const transactionId = `TXN${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    return (
        <div className="receipt-page-wrapper">
            {showSuccessAnimation && (
                <div className="success-animation-overlay">
                    <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                    <p>Payment Successful!</p>
                </div>
            )}
            <Container className="receipt-container-modern py-4">
                <Card className="receipt-card-modern shadow-lg">
                    <Card.Header className="receipt-header-modern text-center">
                        <h3><FontAwesomeIcon icon={faStoreAlt} /> AREA 9 COFFEE</h3>
                        <p className="mb-0"><FontAwesomeIcon icon={faMapMarkerAlt} /> Jl. Sei Wain KM 15 Balikpapan Utara, D'Carjoe Cluster</p>
                    </Card.Header>
                    <Card.Body className="p-4">
                        <div className="receipt-info-modern mb-4">
                            <Row>
                                <Col xs={12} md={6} className="mb-2 mb-md-0">
                                    <p><FontAwesomeIcon icon={faReceipt} className="me-2" /><strong>ID Transaksi:</strong> {transactionId}</p>
                                    <p><FontAwesomeIcon icon={faUser} className="me-2" /><strong>Nama Pelanggan:</strong> {customerName}</p>
                                </Col>
                                <Col xs={12} md={6} className="text-md-end">
                                    <p><FontAwesomeIcon icon={faCalendarAlt} className="me-2" /><strong>Tanggal:</strong> {new Date().toLocaleString()}</p>
                                    <p><FontAwesomeIcon icon={faMoneyBillWave} className="me-2" /><strong>Metode Pembayaran:</strong> {paymentType}</p>
                                </Col>
                            </Row>
                        </div>

                        <h4 className="items-title-modern mb-3">Detail Pesanan:</h4>
                        <Table responsive striped className="receipt-table-modern">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nama Menu</th>
                                    <th className="text-center">Jumlah</th>
                                    <th className="text-end">Total Harga</th>
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
                            <tfoot>
                                <tr className="total-row-modern fw-bold">
                                    <td colSpan="3" className="text-end">Total Pembayaran:</td>
                                    <td className="text-end fs-5">Rp {calculateTotal().toLocaleString('id-ID')}</td>
                                </tr>
                            </tfoot>
                        </Table>

                        <div className="receipt-footer-modern text-center mt-4 pt-3">
                            <p className="thank-you-msg">Terima kasih telah berbelanja di AREA 9 COFFEE!</p>
                            <p className="tagline">~ Have a nice day ~</p>
                        </div>
                    </Card.Body>
                    <Card.Footer className="receipt-actions-modern text-center">
                        <Button variant="outline-secondary" onClick={handlePrint} className="me-2 action-button-receipt">
                            <FontAwesomeIcon icon={faPrint} className="me-2" /> Cetak Resi
                        </Button>
                        <Button variant="primary" onClick={handleBackToDashboard} className="action-button-receipt">
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Kembali ke Dashboard
                        </Button>
                    </Card.Footer>
                </Card>
            </Container>
        </div>
    );
}

export default Receipt;
