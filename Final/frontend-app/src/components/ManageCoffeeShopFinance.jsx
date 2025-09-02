import React, { useState, useEffect, useCallback } from "react";
import { API_URL } from "../config";
import "./ManageCoffeeShopFinance.css";
import { Button, Modal, Form, Dropdown, DropdownButton } from "react-bootstrap";
import { FaPlus, FaPrint, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa"; // Add Edit and Trash icons
import { useNavigate } from "react-router-dom";
import { Doughnut, Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver"; // Import file-saver for CSV download
import { NumericFormat } from "react-number-format"; // Correct import for Vite

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

// Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught by Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

const ManageCoffeeShopFinance = () => {
  const navigate = useNavigate();
  const [showPrintOptions, setShowPrintOptions] = useState(false); // Re-added showPrintOptions state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(null); // New state for auth errors
  const [timeFilter, setTimeFilter] = useState("all"); // State for time filter
  const [displayedTransactions, setDisplayedTransactions] = useState([]); // State for transactions to display
  // State for modal and form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: "expense", // Default set to 'expense' instead of 'income'
    amount: "", // Changed initial amount to empty string
    description: "",
    category: "Coffee Shop",
    payment_method: "cash",
  });
  const [createErrors, setCreateErrors] = useState({}); // New state for create form errors

  // State for Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null); // Store the transaction being edited
  const [editErrors, setEditErrors] = useState({}); // New state for edit form errors

  // State for Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingTransactionId, setDeletingTransactionId] = useState(null);

  // Wrap fetchTransactions in useCallback to ensure stable reference
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (!token) {
        throw new Error("Token tidak ditemukan. Harap login terlebih dahulu.");
      }

      const response = await fetch(
        `${API_URL}/keuangan/detail?category=coffee shop`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Check for specific auth errors
        if (response.status === 401 || response.status === 403) {
          setAuthError("Authentication failed. Please log in again.");
          // Optionally clear transactions or navigate to login
          setTransactions([]); // Clear potentially stale data
        } else {
          setError(new Error(`HTTP error! status: ${response.status}`)); // Set general error
        }
        // Throw an error or return early to stop further processing
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw data from API:", data); // Log raw data
      setAuthError(null); // Clear auth error on success
      // Sort data by created_at date
      const sortedData = data.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      console.log("Sorted transactions data:", sortedData); // Log sorted data
      setTransactions(sortedData);
      setError(null); // Clear general errors on success
    } catch (error) {
      // Only set general error if authError is not already set
      if (!authError) {
        setError(error);
      }
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [authError]); // Empty dependency array means this useCallback version is stable

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Depend on the stable fetchTransactions function

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  useEffect(() => {
    if (!transactions) {
      setDisplayedTransactions([]);
      return;
    }

    let relevantTransactions = transactions.filter(
      (t) => t.category === "Coffee Shop"
    );

    let filteredForDate = relevantTransactions;
    if (timeFilter !== "all") {
      const now = new Date();
      let startDate = new Date();
      now.setHours(23, 59, 59, 999); // End of today

      switch (timeFilter) {
        case "1d":
          startDate.setDate(now.getDate() - 1);
          startDate.setHours(0, 0, 0, 0); // Start of yesterday
          break;
        case "3d":
          startDate.setDate(now.getDate() - 3);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "7d":
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "1m":
          startDate.setMonth(now.getMonth() - 1);
          startDate.setDate(1); // Start of the month
          startDate.setHours(0, 0, 0, 0);
          break;
        case "2m":
          startDate.setMonth(now.getMonth() - 2);
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "3m":
          startDate.setMonth(now.getMonth() - 3);
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "6m":
          startDate.setMonth(now.getMonth() - 6);
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "1y":
          startDate.setFullYear(now.getFullYear() - 1);
          startDate.setMonth(0); // January
          startDate.setDate(1); // 1st
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          // 'all' or unhandled
          break;
      }

      filteredForDate = relevantTransactions.filter((t) => {
        const transactionDate = new Date(t.created_at);
        // For 'all', startDate might not be modified from 'now', so this check is important
        if (timeFilter === "all") return true;
        return transactionDate >= startDate && transactionDate <= now;
      });
    }

    // Recalculate saldo and formattedDate for the filtered transactions
    const processedAndFiltered = filteredForDate.reduce(
      (acc, transaction, index) => {
        const previousSaldo = index === 0 ? 0 : acc[index - 1].saldo;
        let currentSaldo = previousSaldo;
        const amount = parseFloat(transaction.amount) || 0;

        if (transaction.type === "income") {
          currentSaldo += amount;
        } else if (transaction.type === "expense") {
          currentSaldo -= amount;
        }

        let formattedDate = "Tanggal tidak valid";
        try {
          if (
            transaction.created_at &&
            typeof transaction.created_at === "string"
          ) {
            const [datePart, timePart] = transaction.created_at.split(" ");
            if (datePart && timePart) {
              const [year, month, day] = datePart.split("-").map(Number);
              const [hour, minute, second] = timePart.split(":").map(Number);
              if (
                !isNaN(year) &&
                !isNaN(month) &&
                !isNaN(day) &&
                !isNaN(hour) &&
                !isNaN(minute) &&
                !isNaN(second)
              ) {
                const dateObj = new Date(
                  year,
                  month - 1,
                  day,
                  hour,
                  minute,
                  second
                );
                if (!isNaN(dateObj.getTime())) {
                  formattedDate = dateObj.toLocaleString("id-ID", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    timeZone: "Asia/Makassar",
                  });
                }
              }
            }
          }
        } catch (err) {
          console.error(
            "Error formatting date in filter useEffect:",
            err,
            transaction.created_at
          );
        }

        acc.push({ ...transaction, saldo: currentSaldo, formattedDate });
        return acc;
      },
      []
    );

    setDisplayedTransactions(processedAndFiltered);
  }, [transactions, timeFilter]);

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
      type: "expense", // Changed from "income" to "expense"
      amount: "", // Reset amount to empty string for consistency
      description: "",
      category: "Coffee Shop",
      payment_method: "cash", // Reset payment method to 'cash'
    }); // Reset the form
    setCreateErrors({}); // Clear errors when closing modal
  };

  // Handle creating a new transaction
  const handleCreateTransaction = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token tidak ditemukan");
      return;
    }

    const errors = {};
    if (!newTransaction.amount) {
      errors.amount = "Jumlah wajib diisi.";
    }
    if (!newTransaction.description) {
      errors.description = "Deskripsi wajib diisi.";
    }
    if (!newTransaction.payment_method) {
      errors.payment_method = "Metode Pembayaran wajib diisi.";
    }

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/keuangan/detail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTransaction,
          amount: parseFloat(newTransaction.amount), // Ensure amount is a number
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Transaksi berhasil disimpan:", data);

      // Add the new transaction directly to the state and re-sort
      setTransactions((prevTransactions) =>
        [...prevTransactions, data].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
      ); // Close Modal and reset form
      setShowCreateModal(false);
      setNewTransaction({
        type: "expense", // Changed from "income" to "expense"
        amount: "", // Reset amount to empty string for consistency
        description: "",
        category: "Coffee Shop",
        payment_method: "cash", // Reset payment method to 'cash'
      });
      setCreateErrors({}); // Clear errors on successful submission

      // Re-fetch transactions to update the table
      // No need to re-fetch here as we optimistically updated the state
      // fetchTransactions();
    } catch (error) {
      console.error("Error creating transaction:", error);
      setError(error); // Display error to user if needed
    }
  };

  // --- Edit Transaction Logic ---

  const handleEditModal = (transaction) => {
    setEditingTransaction(transaction); // Set the transaction to edit
    setShowEditModal(true); // Show the edit modal
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingTransaction(null); // Clear editing state
    setEditErrors({}); // Clear errors when closing modal
  };

  const handleEditTransactionInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTransaction({
      ...editingTransaction,
      [name]: value,
    });
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("Token tidak ditemukan. Harap login terlebih dahulu.");
      return;
    }

    const errors = {};
    if (!editingTransaction.amount) {
      errors.amount = "Jumlah wajib diisi.";
    }
    if (!editingTransaction.description) {
      errors.description = "Deskripsi wajib diisi.";
    }
    // Payment method is a dropdown, so it should always have a value.
    // if (!editingTransaction.payment_method) {
    //   errors.payment_method = "Metode Pembayaran wajib diisi.";
    // }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/keuangan/detail/${editingTransaction.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...editingTransaction,
            amount: parseFloat(editingTransaction.amount), // Ensure amount is a number
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        if (response.status === 401 || response.status === 403) {
          setAuthError(
            "Authentication failed or insufficient permissions. Please log in again."
          );
        } else {
          setError(
            new Error(
              errorData.message || `HTTP error! status: ${response.status}`
            )
          );
        }
        throw new Error(
          errorData.message || `Update failed with status ${response.status}`
        );
      }

      // Update the transaction in the local state
      setTransactions(
        (prevTransactions) =>
          prevTransactions
            .map(
              (t) =>
                t.id === editingTransaction.id
                  ? {
                      ...editingTransaction,
                      amount: parseFloat(editingTransaction.amount),
                    }
                  : t // Update the specific transaction
            )
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Re-sort after update
      );

      handleCloseEditModal(); // Close modal on success
    } catch (error) {
      console.error("Error updating transaction:", error);
      // Error state is set within the try block for specific errors
    }
  };

  // --- Delete Transaction Logic ---

  const handleDeleteModal = (id) => {
    setDeletingTransactionId(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingTransactionId(null);
  };

  const handleDeleteTransaction = async () => {
    if (!deletingTransactionId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("Token tidak ditemukan. Harap login terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/keuangan/detail/${deletingTransactionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        if (response.status === 401 || response.status === 403) {
          setAuthError(
            "Authentication failed or insufficient permissions. Please log in again."
          );
        } else {
          setError(
            new Error(
              errorData.message || `HTTP error! status: ${response.status}`
            )
          );
        }
        throw new Error(
          errorData.message || `Delete failed with status ${response.status}`
        );
      }

      // Remove the transaction from the local state
      setTransactions((prevTransactions) =>
        prevTransactions.filter((t) => t.id !== deletingTransactionId)
      );

      handleCloseDeleteModal(); // Close modal on success
    } catch (error) {
      console.error("Error deleting transaction:", error);
      // Error state is set within the try block for specific errors
    }
  };

  // Format currency to Rupiah (IDR)
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // The `filteredTransactions` and `transactionsWithSaldo` logic is now handled by the useEffect that populates `displayedTransactions`.
  // We will derive chart data from `displayedTransactions`.

  // Aggregate data by month for the bar chart using displayedTransactions
  const monthlyData = displayedTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.created_at);
    const monthYear = date.toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expense: 0 };
    }

    if (transaction.type === "income") {
      acc[monthYear].income += parseFloat(transaction.amount) || 0;
    } else if (transaction.type === "expense") {
      acc[monthYear].expense += parseFloat(transaction.amount) || 0;
    }

    return acc;
  }, {});

  const months = Object.keys(monthlyData);
  const monthlyIncome = months.map((month) => monthlyData[month].income);
  const monthlyExpense = months.map((month) => monthlyData[month].expense);

  // Create data for Pie chart (Distribusi Pemasukan vs Pengeluaran) using displayedTransactions
  const pieChartData = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        data: [
          Math.max(
            displayedTransactions
              .filter((t) => t.type === "income")
              .reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0),
            0.01
          ),
          Math.max(
            displayedTransactions
              .filter((t) => t.type === "expense")
              .reduce((acc, t) => acc + (parseFloat(t.amount) || 0), 0),
            0.01
          ),
        ],
        backgroundColor: ["#4CAF50", "#FF5733"], // Colors can be updated with theme
        hoverBackgroundColor: ["#45a049", "#ff4731"],
      },
    ],
  };

  // Create data for Bar chart (Perbandingan Pemasukan dan Pengeluaran per Bulan)
  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Pemasukan",
        data: monthlyIncome,
        backgroundColor: "#4CAF50",
        borderColor: "#45a049",
        borderWidth: 1,
      },
      {
        label: "Pengeluaran",
        data: monthlyExpense,
        backgroundColor: "#FF5733",
        borderColor: "#ff4731",
        borderWidth: 1,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += formatRupiah(context.parsed);
            }
            return label;
          },
        },
      },
    },
    hoverOffset: 8,
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
        ticks: {
          callback: function (value) {
            return formatRupiah(value);
          },
          stepSize: 200000, // Set tick increment to 200,000
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatRupiah(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  const handlePrint = (type) => {
    if (type === "csv") {
      const header = [
        "Keterangan",
        "Metode",
        "Pemasukan",
        "Pengeluaran",
        "Saldo",
      ];

      const dataRows = displayedTransactions.map(
        (
          item // Use displayedTransactions
        ) =>
          [
            `"${item.description.replace(/"/g, '""')}"`,
            `"${item.payment_method.replace(/"/g, '""')}"`,
            item.type === "income" ? item.amount : 0,
            item.type === "expense" ? item.amount : 0,
            item.saldo,
          ].join(",")
      );

      const csvContent = [header.join(","), ...dataRows].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "coffee_shop_finance.csv");
    } else if (type === "pdf") {
      window.print();
    } else if (type === "excel") {
      // Mencetak Excel menggunakan XLSX
      const header = [
        "Keterangan",
        "Metode",
        "Pemasukan",
        "Pengeluaran",
        "Saldo",
      ];

      const dataRows = displayedTransactions.map((item) => ({
        // Use displayedTransactions
        Keterangan: item.description,
        Metode: item.payment_method,
        Pemasukan: item.type === "income" ? item.amount : 0,
        Pengeluaran: item.type === "expense" ? item.amount : 0,
        Saldo: item.saldo,
      }));

      const ws = XLSX.utils.json_to_sheet(dataRows, { header });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Keuangan");

      // Menyimpan file Excel
      XLSX.writeFile(wb, "coffee_shop_finance.xlsx");
    }
  };

  return (
    <ErrorBoundary>
      <div className="manage-coffee-shop-finance-container">
        <header className="manage-coffee-shop-finance-header">
          <FaArrowLeft
            className="back-icon"
            onClick={() => navigate("/dashboard")}
          />
          <h2 className="manage-coffee-shop-finance-title">
            Manajemen Keuangan Coffee Shop
          </h2>
        </header>
        {loading && <p>Loading transactions...</p>}
        {authError && <p className="error-message">{authError}</p>}
        {error && <p>Error loading transactions: {error.message}</p>}
        {!loading && !error && (
          <>
            <div
              className="filter-controls-container"
              style={{
                marginBottom: "20px",
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "2.5rem",
              }}
            >
              <DropdownButton
                id="time-filter-dropdown"
                title={`Filter: ${
                  timeFilter === "all"
                    ? "Semua Waktu"
                    : timeFilter === "1d"
                    ? "1 Hari Terakhir"
                    : timeFilter === "3d"
                    ? "3 Hari Terakhir"
                    : timeFilter === "7d"
                    ? "7 Hari Terakhir"
                    : timeFilter === "1m"
                    ? "1 Bulan Terakhir"
                    : timeFilter === "2m"
                    ? "2 Bulan Terakhir"
                    : timeFilter === "3m"
                    ? "3 Bulan Terakhir"
                    : timeFilter === "6m"
                    ? "6 Bulan Terakhir"
                    : timeFilter === "1y"
                    ? "1 Tahun Terakhir"
                    : "Semua Waktu"
                }`}
                onSelect={handleTimeFilterChange}
                variant="info" // Will be styled by CSS later
              >
                <Dropdown.Item eventKey="all">Semua Waktu</Dropdown.Item>
                <Dropdown.Item eventKey="1d">1 Hari Terakhir</Dropdown.Item>
                <Dropdown.Item eventKey="3d">3 Hari Terakhir</Dropdown.Item>
                <Dropdown.Item eventKey="7d">7 Hari Terakhir</Dropdown.Item>
                <Dropdown.Item eventKey="1m">1 Bulan Terakhir</Dropdown.Item>
                <Dropdown.Item eventKey="2m">2 Bulan Terakhir</Dropdown.Item>
                <Dropdown.Item eventKey="3m">3 Bulan Terakhir</Dropdown.Item>
                <Dropdown.Item eventKey="6m">6 Bulan Terakhir</Dropdown.Item>
                <Dropdown.Item eventKey="1y">1 Tahun Terakhir</Dropdown.Item>
              </DropdownButton>
            </div>

            <div className="finance-summary">
              <div className="chart-container">
                <h5>Distribusi Pemasukan vs Pengeluaran</h5>
                <div className="donut-chart-placeholder">
                  <Doughnut data={pieChartData} options={doughnutOptions} />
                </div>
              </div>

              <div className="chart-container">
                <h5>Perbandingan Pemasukan dan Pengeluaran per Bulan</h5>
                <div className="bar-chart-placeholder">
                  <Bar data={barChartData} options={barOptions} />
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <Button
                variant="success"
                onClick={handleCreateModal}
                className="add-button"
              >
                <FaPlus /> Tambah Transaksi Pengeluaran
              </Button>
              <div className="print-button-container">
                <DropdownButton
                  variant="primary"
                  id="dropdown-print-button"
                  onClick={() => setShowPrintOptions(!showPrintOptions)}
                  className="print-button"
                  title={
                    <>
                      <FaPrint /> Cetak
                    </>
                  }
                  drop="down"
                >
                  <Dropdown.Item as="button" onClick={() => handlePrint("csv")}>
                    Cetak CSV
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => handlePrint("pdf")}>
                    Cetak PDF
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => handlePrint("excel")}
                  >
                    Cetak Excel
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            </div>

            <div className="finance-table-container">
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Keterangan</th>
                    <th>Metode</th>
                    <th>Waktu</th> {/* Added Waktu column */}
                    <th>Pemasukan</th>
                    <th>Pengeluaran</th>
                    <th>Saldo</th>
                    <th>Aksi</th> {/* Added Actions column */}
                  </tr>
                </thead>
                <tbody>
                  {displayedTransactions.map(
                    (
                      item,
                      index // Use displayedTransactions
                    ) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.description}</td>
                        <td>{item.payment_method}</td>
                        <td>{item.formattedDate}</td>
                        <td>
                          {item.type === "income"
                            ? formatRupiah(item.amount)
                            : 0}
                        </td>
                        <td>
                          {item.type === "expense"
                            ? formatRupiah(item.amount)
                            : 0}
                        </td>
                        <td>{formatRupiah(item.saldo)}</td>
                        <td>
                          {" "}
                          {/* Actions buttons */}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditModal(item)}
                            style={{ marginRight: "5px" }}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteModal(item.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Modal untuk menambah transaksi */}
        <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Transaksi</Modal.Title>
          </Modal.Header>{" "}
          <Modal.Body>
            <Form>
              {/* Removed Jenis Transaksi dropdown - always expense now */}

              <Form.Group className="mb-3">
                <Form.Label>Jumlah <span className="text-danger">*</span></Form.Label>
                <NumericFormat
                  name="amount"
                  value={newTransaction.amount}
                  onValueChange={(values) => {
                    setNewTransaction({
                      ...newTransaction,
                      amount: values.value, // react-number-format mengembalikan 'value' sebagai float/number
                    });
                    setCreateErrors((prev) => ({ ...prev, amount: null })); // Clear error on change
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="Rp. "
                  placeholder="Masukkan jumlah"
                  className={`form-control ${createErrors.amount ? 'is-invalid' : ''}`}
                  allowNegative={false}
                  isInvalid={!!createErrors.amount}
                  required // Added required attribute
                />
                <Form.Control.Feedback type="invalid">
                  {createErrors.amount}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Deskripsi <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={newTransaction.description}
                  onChange={(e) => {
                    handleNewTransactionInputChange(e);
                    setCreateErrors((prev) => ({ ...prev, description: null })); // Clear error on change
                  }}
                  placeholder="Masukkan deskripsi"
                  isInvalid={!!createErrors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {createErrors.description}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Metode Pembayaran <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="select" // Menjadikan ini dropdown menu
                  name="payment_method"
                  value={newTransaction.payment_method}
                  onChange={(e) => {
                    handleNewTransactionInputChange(e);
                    setCreateErrors((prev) => ({ ...prev, payment_method: null })); // Clear error on change
                  }}
                  isInvalid={!!createErrors.payment_method}
                >
                  <option value="cash">Tunai</option>{" "}
                  {/* Contoh metode pembayaran Tunai */}
                  <option value="qris">QRIS</option>{" "}
                  {/* Contoh metode pembayaran QRIS */}
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                  {createErrors.payment_method}
                </Form.Control.Feedback>
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

        {/* Modal untuk mengedit transaksi */}
        <Modal show={showEditModal} onHide={handleCloseEditModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Transaksi</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingTransaction && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Jenis Transaksi</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    value={editingTransaction.type}
                    onChange={handleEditTransactionInputChange}
                  >
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Jumlah <span className="text-danger">*</span></Form.Label>
                  <NumericFormat
                    name="amount"
                    value={editingTransaction.amount}
                    onValueChange={(values) => {
                      setEditingTransaction({
                        ...editingTransaction,
                        amount: values.value, // react-number-format mengembalikan 'value' sebagai float/number
                      });
                      setEditErrors((prev) => ({ ...prev, amount: null })); // Clear error on change
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp. "
                    placeholder="Masukkan jumlah"
                    className={`form-control ${editErrors.amount ? 'is-invalid' : ''}`}
                    allowNegative={false}
                    isInvalid={!!editErrors.amount}
                    required // Added required attribute
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.amount}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Deskripsi <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={editingTransaction.description}
                    onChange={(e) => {
                      handleEditTransactionInputChange(e);
                      setEditErrors((prev) => ({ ...prev, description: null })); // Clear error on change
                    }}
                    placeholder="Masukkan deskripsi"
                    isInvalid={!!editErrors.description}
                    required // Added required attribute
                  />
                  <Form.Control.Feedback type="invalid">
                    {editErrors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Metode Pembayaran</Form.Label>
                  <Form.Control
                    as="select"
                    name="payment_method"
                    value={editingTransaction.payment_method}
                    onChange={handleEditTransactionInputChange}
                  >
                    <option value="cash">Tunai</option>
                    <option value="qris">QRIS</option>
                  </Form.Control>
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleUpdateTransaction}>
              Simpan Perubahan
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Konfirmasi Hapus */}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Hapus</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak
            dapat dibatalkan.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
              Batal
            </Button>
            <Button variant="danger" onClick={handleDeleteTransaction}>
              Hapus
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </ErrorBoundary>
  );
};

export default ManageCoffeeShopFinance;
