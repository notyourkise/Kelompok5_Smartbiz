import React, { useState, useEffect } from "react";
import "./ManageKostFinance.css";
import { Button, Modal, Form } from "react-bootstrap"; // Import Modal and Form
import { FaPlus, FaPrint, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Line, Pie } from "react-chartjs-2"; // Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ManageKostFinance = () => {
  const navigate = useNavigate();
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null); // Added for consistency

  // State for modal and form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "income", // Default set to 'income'
    amount: 0,
    description: "",
    category: "Kost",
    payment_method: "",
  });

  // Wrap fetchTransactions in useCallback
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setAuthError(null); // Reset auth error on fetch attempt
    setError(null); // Reset general error on fetch attempt
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (!token) {
        setAuthError("Token tidak ditemukan. Harap login terlebih dahulu.");
        setTransactions([]); // Clear data if no token
        return; // Stop fetching if no token
      }

      const response = await fetch(
        "http://localhost:3001/keuangan/detail?category=kost",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setAuthError("Autentikasi gagal. Silakan login kembali.");
          setTransactions([]); // Clear data on auth failure
        } else {
          setError(new Error(`HTTP error! status: ${response.status}`));
        }
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw data from API (Kost):", data); // Log raw data

      // Urutkan data berdasarkan waktu transaksi (created_at)
      const sortedData = data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      console.log("Sorted transactions data (Kost):", sortedData); // Log sorted data
      setTransactions(sortedData);

    } catch (error) {
      // Error state is set within the try block for specific errors
      console.error("Error fetching Kost transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array ensures stable function reference

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Depend on the stable fetchTransactions

  // Handle form input change untuk transaksi baru
  const handleNewTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: value,
    });
  };

  // Handle Modal Create
  const handleCreateModal = () => {
    setShowCreateModal(true); // Tampilkan Modal
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false); // Tutup Modal
    setNewTransaction({
      type: "income",
      amount: 0,
      description: "",
      category: "Kost",
      payment_method: "",
    }); // Reset form
  };

  // Handle menyimpan transaksi baru
  const handleCreateTransaction = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan");
      return;
    }

    try {
      console.log("Data yang akan dikirim:", newTransaction);

      const response = await fetch("http://localhost:3001/keuangan/detail", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newTransactionData = await response.json(); // Get the newly created transaction data
      console.log("Transaksi Kost berhasil disimpan:", newTransactionData);

      // Re-fetch transactions to update the list automatically
      fetchTransactions();

      // Tutup Modal dan Reset form
      setShowCreateModal(false);
      setNewTransaction({
        type: "income",
        amount: 0,
        description: "",
        category: "Kost",
        payment_method: "",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  // Fungsi untuk menghitung saldo
  const calculateSaldo = (transactions) => {
    let currentSaldo = 0;
    return transactions.map((transaction) => {
      if (transaction.type === "income") {
        currentSaldo += parseFloat(transaction.amount) || 0; // Pastikan amount valid
      } else if (transaction.type === "expense") {
        currentSaldo -= parseFloat(transaction.amount) || 0; // Pastikan amount valid
      }
      return { ...transaction, saldo: currentSaldo };
    });
  };

  // Format currency to Rupiah (IDR)
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Filter transaksi hanya dengan kategori 'kost'
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.category === "Kost"
  );
  const transactionsWithSaldo = calculateSaldo(filteredTransactions);

  // Create data for Pie chart (Distribusi Pemasukan vs Pengeluaran)
  const pieChartData = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        data: [
          // Make sure that we handle the cases where income is zero or not available
          Math.max(
            transactionsWithSaldo
              .filter((t) => t.type === "income")
              .reduce((acc, t) => acc + t.amount, 0),
            0.01 // Default value to ensure the segment is visible even when it's zero
          ),
          Math.max(
            transactionsWithSaldo
              .filter((t) => t.type === "expense")
              .reduce((acc, t) => acc + t.amount, 0),
            0.01 // Same for expenses, to avoid zero values
          ),
        ],
        backgroundColor: ["#4CAF50", "#FF5733"],
        hoverBackgroundColor: ["#45a049", "#ff4731"],
      },
    ],
  };

  // Create data for Bar chart (Perbandingan Pemasukan dan Pengeluaran)
  const barChartData = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        label: "Pemasukan vs Pengeluaran",
        data: [
          transactionsWithSaldo
            .filter((t) => t.type === "income")
            .reduce((acc, t) => acc + t.amount, 0),
          transactionsWithSaldo
            .filter((t) => t.type === "expense")
            .reduce((acc, t) => acc + t.amount, 0),
        ],
        backgroundColor: ["#4CAF50", "#FF5733"],
        borderColor: ["#45a049", "#ff4731"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="manage-kost-finance-container">
      <header className="manage-kost-finance-header">
        <FaArrowLeft
          className="back-icon"
          onClick={() => navigate("/dashboard")}
        />
        <h2 className="manage-kost-finance-title">Manajemen Keuangan Kost</h2>
      </header>

      {loading && <p>Loading transactions...</p>}
      {authError && <p className="error-message">{authError}</p>} {/* Display auth errors */}
      {error && !authError && <p>Error loading transactions: {error.message}</p>} {/* Display general errors only if no auth error */}

      {!loading && !error && !authError && (
        <>
          <div className="finance-summary">
            <div className="chart-container">
              <h5>Distribusi Pemasukan vs Pengeluaran</h5>
              <div className="donut-chart-placeholder">
                <Pie data={pieChartData} />
              </div>
            </div>

            <div className="chart-container">
              <h5>Perbandingan Pemasukan dan Pengeluaran</h5>
              <div className="bar-chart-placeholder">
                <Line data={barChartData} />
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <Button
              variant="success"
              onClick={handleCreateModal}
              className="add-button"
            >
              <FaPlus /> Tambah Transaksi
            </Button>
            <div className="print-button-container">
              <Button
                variant="primary"
                onClick={() => setShowPrintOptions(!showPrintOptions)}
                className="print-button"
              >
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
                    <td>
                      {item.type === "income" ? formatRupiah(item.amount) : 0}
                    </td>
                    <td>
                      {item.type === "expense" ? formatRupiah(item.amount) : 0}
                    </td>
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

export default ManageKostFinance;
