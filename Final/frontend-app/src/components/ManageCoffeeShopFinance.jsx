import React, { useState, useEffect } from 'react';
import './ManageCoffeeShopFinance.css';
import { Button } from 'react-bootstrap'; // Assuming Bootstrap buttons are still used
import { FaPlus, FaPrint, FaArrowLeft } from 'react-icons/fa'; // Icons for Add, Print, and Back
import { useNavigate } from 'react-router-dom'; // For navigation

// Assuming chart libraries will be added later, using placeholders for now
// import { Pie, Bar } from 'react-chartjs-2';

const ManageCoffeeShopFinance = () => {
  const navigate = useNavigate();
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Assuming an API endpoint for fetching transactions by category
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Authentication token not found. Cannot fetch transactions.");
          return;
        }
        const response = await fetch('http://localhost:3001/api/keuangan/coffee-shop', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setError(error);
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleAddData = () => {
    // Logic to add new data - navigate to a new page or show a modal
    console.log('Tambah data clicked');
  };

  const handlePrint = () => {
    setShowPrintOptions(!showPrintOptions);
  };

  const handlePrintCSV = () => {
    // Logic to print as CSV
    console.log('Cetak CSV clicked');
    setShowPrintOptions(false);
  };

  const handlePrintExcel = () => {
    // Logic to print as Excel
    console.log('Cetak Excel clicked');
    setShowPrintOptions(false);
  };

  const handleBack = () => {
    navigate('/dashboard'); // Navigate back to the dashboard
  };

  // Function to calculate saldo
  const calculateSaldo = (transactions) => {
    let currentSaldo = 0;
    return transactions.map(transaction => {
      if (transaction.type === 'pemasukan') {
        currentSaldo += transaction.amount;
      } else if (transaction.type === 'pengeluaran') {
        currentSaldo -= transaction.amount;
      }
      return { ...transaction, saldo: currentSaldo };
    });
  };

  const transactionsWithSaldo = calculateSaldo(transactions);


  // Placeholder data for charts - will need to be calculated from fetched data
  const chartData = {
    pemasukan: 71.4, // Example percentage
    pengeluaran: 28.6, // Example percentage
    labels: ['Pemasukan', 'Pengeluaran'],
    pemasukanAmount: 0, // Calculate from data
    pengeluaranAmount: 0, // Calculate from data
  };

  // Calculate chart data from transactions
  if (transactions.length > 0) {
      const totalPemasukan = transactions.filter(t => t.type === 'pemasukan').reduce((sum, t) => sum + t.amount, 0);
      const totalPengeluaran = transactions.filter(t => t.type === 'pengeluaran').reduce((sum, t) => sum + t.amount, 0);
      const total = totalPemasukan + totalPengeluaran;
      chartData.pemasukan = total > 0 ? (totalPemasukan / total) * 100 : 0;
      chartData.pengeluaran = total > 0 ? (totalPengeluaran / total) * 100 : 0;
      chartData.pemasukanAmount = totalPemasukan;
      chartData.pengeluaranAmount = totalPengeluaran;
  }


  return (
    <div className="manage-coffee-shop-finance-container">
      <header className="manage-coffee-shop-finance-header">
        <FaArrowLeft className="back-icon" onClick={handleBack} />
        <h2 className="manage-coffee-shop-finance-title">Manajemen Keuangan Coffee Shop</h2>
        <div></div> {/* Empty div for spacing */}
      </header>


      {loading && <p>Loading transactions...</p>}
      {error && <p>Error loading transactions: {error.message}</p>}

      {!loading && !error && (
        <>
          <div className="finance-summary">
            <div className="chart-container">
              <h5>Distribusi Pemasukan vs Pengeluaran</h5>
              {/* Placeholder for Donut Chart */}
              <div className="donut-chart-placeholder">
                 Donut Chart Placeholder ({chartData.pemasukan.toFixed(2)}% Pemasukan, {chartData.pengeluaran.toFixed(2)}% Pengeluaran)
              </div>
              {/* Actual Donut Chart would go here */}
              {/* <Pie data={{ labels: chartData.labels, datasets: [{ data: [chartData.pemasukan, chartData.pengeluaran], backgroundColor: ['#2ecc71', '#e74c3c'] }] }} /> */}
            </div>

            <div className="chart-container">
               <h5>Perbandingan Pemasukan dan Pengeluaran</h5>
               {/* Placeholder for Bar Chart */}
               <div className="bar-chart-placeholder">
                  Bar Chart Placeholder (Pemasukan: {chartData.pemasukanAmount}, Pengeluaran: {chartData.pengeluaranAmount})
               </div>
               {/* Actual Bar Chart would go here */}
               {/* <Bar data={{ labels: chartData.labels, datasets: [{ label: 'Jumlah', data: [chartData.pemasukanAmount, chartData.pengeluaranAmount], backgroundColor: ['#2ecc71', '#e74c3c'] }] }} /> */}
            </div>
          </div>


          <div className="action-buttons">
            <Button variant="success" onClick={handleAddData} className="add-button">
              <FaPlus /> Tambah
            </Button>
            <div className="print-button-container">
              <Button variant="primary" onClick={handlePrint} className="print-button">
                <FaPrint /> Cetak
              </Button>
              {showPrintOptions && (
                <div className="print-options">
                  <Button variant="light" onClick={handlePrintCSV} className="print-option-button">Cetak CSV</Button>
                  <Button variant="light" onClick={handlePrintExcel} className="print-option-button">Cetak Excel</Button>
                </div>
              )}
            </div>
          </div>


          <div className="finance-table-container">
            <table className="finance-table"><thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Keterangan</th>
                  <th>Metode</th>
                  <th>Pemasukan</th>
                  <th>Pengeluaran</th>
                  <th>Saldo</th>
                </tr>
              </thead><tbody>
                {transactionsWithSaldo.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>{item.description}</td>
                    <td>{item.payment_method}</td>
                    <td>{item.type === 'pemasukan' ? item.amount : 0}</td>
                    <td>{item.type === 'pengeluaran' ? item.amount : 0}</td>
                    <td>{item.saldo}</td>
                  </tr>
                ))}
              </tbody></table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCoffeeShopFinance;
