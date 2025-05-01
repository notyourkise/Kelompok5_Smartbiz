import React, { useState, useEffect } from 'react';
import './ManageCoffeeShopFinance.css';
import { Button, Modal, Form } from 'react-bootstrap'; // Import Modal and Form
import { FaPlus, FaPrint, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';  // Import Chart.js components
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const ManageCoffeeShopFinance = () => {
  const navigate = useNavigate();
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modal and form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'income', // Default set to 'income'
    amount: 0,
    description: '',
    category: 'Coffee Shop',
    payment_method: '',
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token'); // Ambil token dari localStorage
        if (!token) {
          throw new Error('Token tidak ditemukan. Harap login terlebih dahulu.');
        }

        const response = await fetch('http://localhost:3001/keuangan/detail?category=coffee shop', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Sort data by created_at date
        const sortedData = data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        setTransactions(sortedData);
      } catch (error) {
        setError(error);
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle form input change for new transaction
  const handleNewTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  // Handle Create Modal
  const handleCreateModal = () => {
    setShowCreateModal(true); // Show Create Transaction Modal
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false); // Close the modal
    setNewTransaction({
      type: 'income',
      amount: 0,
      description: '',
      category: 'Coffee Shop',
      payment_method: '',
    }); // Reset the form
  };

  // Handle creating a new transaction
  const handleCreateTransaction = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token tidak ditemukan');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/keuangan/detail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Transaksi berhasil disimpan:', data);

      // After successful creation, re-fetch data to update the table and charts
      fetchTransactions();

      // Close Modal and reset form
      setShowCreateModal(false);
      setNewTransaction({
        type: 'income',
        amount: 0,
        description: '',
        category: 'Coffee Shop',
        payment_method: '',
      });

    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  // Calculate saldo
  const calculateSaldo = (transactions) => {
    let currentSaldo = 0;
    return transactions.map(transaction => {
      if (transaction.type === 'income') {
        currentSaldo += parseFloat(transaction.amount) || 0;
      } else if (transaction.type === 'expense') {
        currentSaldo -= parseFloat(transaction.amount) || 0;
      }
      return { ...transaction, saldo: currentSaldo };
    });
  };

  // Format currency to Rupiah (IDR)
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

// Filter transaksi hanya dengan kategori 'coffee shop'
const filteredTransactions = transactions.filter(transaction => transaction.category === 'Coffee Shop');
const transactionsWithSaldo = calculateSaldo(filteredTransactions);

// Create data for Pie chart (Distribusi Pemasukan vs Pengeluaran)
const pieChartData = {
  labels: ['Pemasukan', 'Pengeluaran'],
  datasets: [
    {
      data: [
        transactionsWithSaldo.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
        transactionsWithSaldo.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
      ],
      backgroundColor: ['#4CAF50', '#FF5733'],
      hoverBackgroundColor: ['#45a049', '#ff4731']
    }
  ]
};

// Create data for Bar chart (Perbandingan Pemasukan dan Pengeluaran per Transaksi)
const barChartData = {
  labels: transactionsWithSaldo.map(item => item.description), // Use transaction description as labels
  datasets: [
    {
      label: 'Pemasukan',
      data: transactionsWithSaldo.map(item => item.type === 'income' ? item.amount : 0), // Data for income
      backgroundColor: '#4CAF50',
      borderColor: '#45a049',
      borderWidth: 1
    },
    {
      label: 'Pengeluaran',
      data: transactionsWithSaldo.map(item => item.type === 'expense' ? item.amount : 0), // Data for expense
      backgroundColor: '#FF5733',
      borderColor: '#ff4731',
      borderWidth: 1
    }
  ]
};

  return (
    <div className="manage-coffee-shop-finance-container">
      <header className="manage-coffee-shop-finance-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate('/dashboard')} />
        <h2 className="manage-coffee-shop-finance-title">Manajemen Keuangan Coffee Shop</h2>
      </header>

      {loading && <p>Loading transactions...</p>}
      {error && <p>Error loading transactions: {error.message}</p>}

      {!loading && !error && (
        <>
          <div className="finance-summary">
            <div className="chart-container">
              <h5>Distribusi Pemasukan vs Pengeluaran</h5>
              <div className="donut-chart-placeholder">
                <Pie key={transactions.length} data={pieChartData} />
              </div>
            </div>

            <div className="chart-container">
              <h5>Perbandingan Pemasukan dan Pengeluaran</h5>
              <div className="bar-chart-placeholder">
                <Bar key={transactions.length} data={barChartData} />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <Button variant="success" onClick={handleCreateModal} className="add-button">
              <FaPlus /> Tambah Transaksi
            </Button>
            <div className="print-button-container">
              <Button variant="primary" onClick={() => window.print()} className="print-button">
                <FaPrint /> Cetak
              </Button>
            </div>
          </div>

          <div className="finance-table-container">
            <table className="finance-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Keterangan</th>
                  <th>Metode</th>
                  <th>Pemasukan</th>
                  <th>Pengeluaran</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {transactionsWithSaldo.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.description}</td>
                    <td>{item.payment_method}</td>
                    <td>{item.type === 'income' ? formatRupiah(item.amount) : 0}</td>
                    <td>{item.type === 'expense' ? formatRupiah(item.amount) : 0}</td>
                    <td>{formatRupiah(item.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal untuk menambah transaksi */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Transaksi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Transaksi</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={newTransaction.type}
                onChange={handleNewTransactionInputChange}
              >
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Jumlah</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={handleNewTransactionInputChange}
                placeholder="Masukkan jumlah"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleNewTransactionInputChange}
                placeholder="Masukkan deskripsi"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Metode Pembayaran</Form.Label>
              <Form.Control
                type="text"
                name="payment_method"
                value={newTransaction.payment_method}
                onChange={handleNewTransactionInputChange}
                placeholder="Masukkan metode pembayaran"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleCreateTransaction}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageCoffeeShopFinance;
