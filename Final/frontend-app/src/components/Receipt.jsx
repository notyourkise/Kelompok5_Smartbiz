import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import './Receipt.css';

function Receipt() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, customerName, paymentType } = location.state || { cart: [], customerName: 'Customer', paymentType: 'Tunai' };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handlePrint = () => {
        window.print();
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className="receipt-container">
            <div className="receipt-header">
                <h2>AREA 9 COFFEE</h2>
                <p>Jl. Sei Wain KM 15 Balikpapan Utara</p>
                <p>D'Carjoe Cluster</p>
                <p>--------------------------------</p>
            </div>

            <div className="receipt-info">
                <p><strong>ID Transaksi:</strong> 8743621A96</p>
                <p><strong>Tanggal:</strong> {new Date().toLocaleString()}</p>
                <p><strong>Nama Pelanggan:</strong> {customerName}</p>
                <p><strong>Metode Pembayaran:</strong> {paymentType}</p>
            </div>

            <div className="receipt-items">
                <table>
                    <thead>
                        <tr>
                            <th>Nama Menu</th>
                            <th>Jumlah</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity} x</td>
                                <td>Rp {parseFloat(item.price * item.quantity).toLocaleString('id-ID')}</td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td colSpan="2">Total Pembayaran</td>
                            <td>Rp {calculateTotal().toLocaleString('id-ID')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="receipt-footer">
                <p>--------------------------------</p>
                <p>Terima kasih telah berbelanja!</p>
                <p>~ Have a nice day ~</p>
            </div>

            <div className="button-container">
                <Button className="print-button" onClick={handlePrint}>
                    Cetak
                </Button>
                <Button className="back-button" onClick={handleBackToDashboard}>
                    Kembali
                </Button>
            </div>
        </div>
    );
}

export default Receipt;
