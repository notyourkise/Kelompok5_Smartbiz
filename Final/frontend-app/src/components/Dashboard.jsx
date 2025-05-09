import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Dropdown, Button, Spinner } from 'react-bootstrap'; // Tambahkan Spinner
import {
  FaTachometerAlt, FaDollarSign, FaBed, FaCoffee, FaUser, FaBox, FaSignOutAlt, FaUserCircle, FaFilter, FaWarehouse, FaStore, FaExclamationCircle // Tambahkan ikon baru
} from 'react-icons/fa';
import axios from 'axios'; // Import axios
import Footer from './Footer';
import './Dashboard.css'; // Pastikan CSS diimpor

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: null,
    monthlyIncome: null, 
    monthlyExpense: null, // Added for this month's expenses
    availableRooms: null,
    menuItems: null,
    loading: true,
    error: null,
  });

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token'); // Ambil token

  // --- Fetch Statistik ---
  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        setStats(prev => ({ ...prev, loading: false, error: 'Autentikasi tidak ditemukan.' }));
        return;
      }

      setStats(prev => ({ ...prev, loading: true, error: null }));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      try {
        // Definisikan endpoint (gunakan URL lengkap dengan port backend)
        const userEndpoint = 'http://localhost:3001/api/users';
        const roomEndpoint = 'http://localhost:3001/api/kos';
        const menuEndpoint = 'http://localhost:3001/coffee-shop/menus';
        const kostFinanceEndpoint = 'http://localhost:3001/keuangan/detail?category=kost';
        const coffeeFinanceEndpoint = 'http://localhost:3001/keuangan/detail?category=coffee shop';

        // Lakukan request API secara paralel
        const [userRes, roomRes, menuRes, kostFinanceRes, coffeeFinanceRes] = await Promise.all([
          axios.get(userEndpoint, config),
          axios.get(roomEndpoint, config),
          axios.get(menuEndpoint, config),
          axios.get(kostFinanceEndpoint, config), // Ambil transaksi Kost
          axios.get(coffeeFinanceEndpoint, config) // Ambil transaksi Coffee Shop
        ]);

        // Hitung statistik dasar
        const totalUsers = Array.isArray(userRes.data) ? userRes.data.length : 0;
        const menuItems = Array.isArray(menuRes.data) ? menuRes.data.length : 0;

        // Hitung kamar tersedia
        let availableRooms = 'Error';
        if (Array.isArray(roomRes.data)) {
            try {
                availableRooms = roomRes.data.filter(room => String(room.availability).toLowerCase() === 'true').length;
            } catch (filterError) { console.error("Error filtering rooms:", filterError); }
        } else { console.warn("API response for rooms is not an array:", roomRes.data); }

        // Hitung Pendapatan Bulan Ini
        let calculatedMonthlyIncome = 'Error';
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        try {
            const kostTransactions = Array.isArray(kostFinanceRes.data) ? kostFinanceRes.data : [];
            const coffeeTransactions = Array.isArray(coffeeFinanceRes.data) ? coffeeFinanceRes.data : [];
            const allTransactions = [...kostTransactions, ...coffeeTransactions];

            const monthlyIncomeSum = allTransactions
                .filter(t => {
                    if (t.type !== 'income' || !t.created_at) return false;
                    try {
                        // Coba parse tanggal. Asumsikan format 'YYYY-MM-DD HH:MI:SS' dan mungkin UTC
                        // Tambahkan 'T' dan 'Z' untuk parsing yang lebih robust
                        const dateStr = t.created_at.includes('T') ? t.created_at : t.created_at.replace(' ', 'T') + 'Z';
                        const transactionDate = new Date(dateStr);
                        if (isNaN(transactionDate.getTime())) {
                             console.warn("Invalid date format encountered:", t.created_at);
                             return false; // Abaikan tanggal tidak valid
                        }
                        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
                    } catch (dateError) {
                        console.error("Error parsing transaction date:", t.created_at, dateError);
                        return false;
                    }
                })
                .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

            // Format ke Rupiah
             calculatedMonthlyIncome = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(monthlyIncomeSum);

        } catch (calcError) {
            console.error("Error calculating monthly income:", calcError);
            // calculatedMonthlyIncome tetap 'Error'
        }

        // Hitung Pengeluaran Bulan Ini
        let calculatedMonthlyExpense = 'Error';
        try {
            const kostTransactions = Array.isArray(kostFinanceRes.data) ? kostFinanceRes.data : [];
            const coffeeTransactions = Array.isArray(coffeeFinanceRes.data) ? coffeeFinanceRes.data : [];
            const allTransactions = [...kostTransactions, ...coffeeTransactions];
            const monthlyExpenseSum = allTransactions
                .filter(t => {
                    if (t.type !== 'expense' || !t.created_at) return false;
                    try {
                        const dateStr = t.created_at.includes('T') ? t.created_at : t.created_at.replace(' ', 'T') + 'Z';
                        const transactionDate = new Date(dateStr);
                        if (isNaN(transactionDate.getTime())) {
                             console.warn("Invalid date format encountered:", t.created_at);
                             return false;
                        }
                        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
                    } catch (dateError) {
                        console.error("Error parsing transaction date:", t.created_at, dateError);
                        return false;
                    }
                })
                .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

            calculatedMonthlyExpense = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(monthlyExpenseSum);

        } catch (calcError) {
            console.error("Error calculating monthly expense:", calcError);
            // calculatedMonthlyExpense tetap 'Error'
        }

        setStats({
          totalUsers: totalUsers,
          monthlyIncome: calculatedMonthlyIncome,
          monthlyExpense: calculatedMonthlyExpense, // Added monthly expense
          availableRooms: availableRooms,
          menuItems: menuItems,
          loading: false,
          error: null,
        });

      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        let errorMessage = 'Gagal mengambil data statistik.';
        if (err.response?.status === 401 || err.response?.status === 403) {
            errorMessage = 'Sesi berakhir atau akses ditolak. Silakan login kembali.';
        }
         setStats(prev => ({
              ...prev,
              totalUsers: 'Error',
              availableRooms: 'Error',
              menuItems: 'Error',
              monthlyIncome: 'Error',
              monthlyExpense: 'Error', // Set expense to Error as well
              loading: false,
              error: errorMessage
         }));
      }
    };

    if (activeView === 'dashboard') {
        fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, token]); // Re-fetch jika activeView kembali ke dashboard atau token berubah

  // --- Fungsi Navigasi ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleCoffeeShopFinanceClick = () => navigate('/finance/coffee-shop');
  const handleKostFinanceClick = () => navigate('/finance/kost');
  const handleInventarisCoffeeShopClick = () => navigate('/inventaris/coffee-shop');
  const handleInventarisKostClick = () => navigate('/inventaris/kost');
  const handleManageUser = () => navigate('/manage-user');
  const handleManageKos = () => navigate('/manage-kos');
  const handleManageCoffeeShopMenu = () => navigate('/manage-coffee-shop-menu');

  // --- Render Konten ---
  const renderMainContent = () => {
    switch (activeView) {
      case 'finance':
        // ... (Konten sub-menu finance tetap sama)
        return (
          <>
            <h3>Manajemen Keuangan</h3>
            <Row xs={1} md={2} className="g-4">
              <Col>
                <Card className="dashboard-card-modern">
                  <Card.Body>
                    <FaStore className="card-icon-modern" />
                    <Card.Title>Coffee Shop</Card.Title>
                    <Card.Text>Kelola keuangan Coffee Shop.</Card.Text>
                    <Button variant="success" onClick={handleCoffeeShopFinanceClick}>Kelola</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="dashboard-card-modern">
                  <Card.Body>
                    <FaBed className="card-icon-modern" />
                    <Card.Title>Kost</Card.Title>
                    <Card.Text>Kelola keuangan Kost.</Card.Text>
                    <Button variant="success" onClick={handleKostFinanceClick}>Kelola</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
      case 'inventory':
         // ... (Konten sub-menu inventory tetap sama)
        return (
          <>
            <h3>Manajemen Inventaris</h3>
            <Row xs={1} md={2} className="g-4">
              <Col>
                <Card className="dashboard-card-modern">
                  <Card.Body>
                    <FaStore className="card-icon-modern" />
                    <Card.Title>Inventaris Coffee Shop</Card.Title>
                    <Card.Text>Kelola inventaris Coffee Shop.</Card.Text>
                    <Button variant="primary" onClick={handleInventarisCoffeeShopClick}>Kelola</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="dashboard-card-modern">
                  <Card.Body>
                    <FaBed className="card-icon-modern" />
                    <Card.Title>Inventaris Kost</Card.Title>
                    <Card.Text>Kelola inventaris Kost.</Card.Text>
                    <Button variant="primary" onClick={handleInventarisKostClick}>Kelola</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
      case 'dashboard':
      default:
        // Helper untuk render nilai statistik (handle loading & error)
        const renderStatValue = (valueKey) => {
            const value = stats[valueKey];
            if (stats.loading) return <Spinner animation="border" size="sm" />;
            // Tampilkan error jika value spesifik adalah 'Error' ATAU jika ada error global fetch
            if (value === 'Error' || (stats.error && valueKey !== 'monthlyIncome')) { // Jangan tunjukkan error global di income jika income sendiri berhasil dihitung
                 return <FaExclamationCircle className="text-danger" title={stats.error || 'Gagal memuat data'} />;
            }
             if (value === null) return '-'; // Tampilkan '-' jika null setelah loading selesai
             return value; // Tampilkan nilai jika valid
        };
        return (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Ringkasan Statistik</h3>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-filter" size="sm">
                  <FaFilter /> Filter Waktu
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#">Hari Ini</Dropdown.Item>
                  <Dropdown.Item href="#">7 Hari Terakhir</Dropdown.Item>
                  <Dropdown.Item href="#">Bulan Ini</Dropdown.Item>
                  <Dropdown.Item href="#">Tahun Ini</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {stats.error && <div className="alert alert-danger">{stats.error}</div>}
            <Row xs={1} md={2} lg={3} className="g-4">
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-primary"><FaUser /></div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">Total Pengguna</Card.Subtitle>
                      <Card.Title className="widget-value">{renderStatValue('totalUsers')}</Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-success"><FaDollarSign /></div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">Pendapatan Bulan Ini</Card.Subtitle>
                        {/* Render income secara terpisah karena tidak pakai placeholder [Data] lagi */}
                       <Card.Title className="widget-value">
                           {stats.loading ? <Spinner animation="border" size="sm" /> :
                            (stats.monthlyIncome === 'Error' || (stats.error && !stats.monthlyExpense)) ? <FaExclamationCircle className="text-danger" title={stats.error || 'Gagal menghitung pendapatan'} /> :
                            stats.monthlyIncome ?? '-'}
                       </Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    {/* Using bg-danger for expense icon background */}
                    <div className="widget-icon bg-danger"><FaDollarSign /></div> 
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">Pengeluaran Bulan Ini</Card.Subtitle>
                      <Card.Title className="widget-value">
                           {stats.loading ? <Spinner animation="border" size="sm" /> :
                            (stats.monthlyExpense === 'Error' || (stats.error && !stats.monthlyIncome)) ? <FaExclamationCircle className="text-danger" title={stats.error || 'Gagal menghitung pengeluaran'} /> :
                            stats.monthlyExpense ?? '-'}
                      </Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-info"><FaBed /></div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">Kamar Tersedia</Card.Subtitle>
                      <Card.Title className="widget-value">{renderStatValue('availableRooms')}</Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
               <Col>
                <Card className="widget-card">
                  <Card.Body>
                    <div className="widget-icon bg-warning"><FaCoffee /></div>
                    <div className="widget-content">
                      <Card.Subtitle className="text-muted">Item Menu Kopi</Card.Subtitle>
                      <Card.Title className="widget-value">{renderStatValue('menuItems')}</Card.Title>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        );
    }
  };

  // --- Render Komponen Utama ---
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Nav className="flex-column sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Smartbiz</h2>
        </div>
        <Nav.Link onClick={() => setActiveView('dashboard')} active={activeView === 'dashboard'}>
          <FaTachometerAlt className="sidebar-icon icon-dashboard" /> Dashboard
        </Nav.Link>
        {role === 'superadmin' && (
          <Nav.Link onClick={() => setActiveView('finance')} active={activeView === 'finance'}>
            <FaDollarSign className="sidebar-icon icon-finance" /> Manajemen Keuangan
          </Nav.Link>
        )}
        {role === 'superadmin' && (
           <Nav.Link onClick={handleManageKos}>
             <FaBed className="sidebar-icon icon-kos" /> Kamar Kos
           </Nav.Link>
        )}
         <Nav.Link onClick={handleManageCoffeeShopMenu}>
           <FaCoffee className="sidebar-icon icon-coffee" /> Coffee Shop Menu
         </Nav.Link>
        {role === 'superadmin' && (
          <Nav.Link onClick={handleManageUser}>
            <FaUser className="sidebar-icon icon-user" /> Manajemen User
          </Nav.Link>
        )}
        {role === 'superadmin' && (
          <Nav.Link onClick={() => setActiveView('inventory')} active={activeView === 'inventory'}>
            <FaWarehouse className="sidebar-icon icon-inventory" /> Manajemen Inventaris
          </Nav.Link>
        )}
        {/* Tambahkan Nav.Link lain jika perlu */}
      </Nav>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header within Main Content */}
        <header className="main-header">
          <div className="header-welcome">
             {/* Tampilkan pesan selamat datang hanya jika username ada */}
             {username && <h3 className="welcome-message">Selamat Datang, {username}!</h3>}
             {role && <h5 className="role-display">Role: {role}</h5>}
          </div>
          {/* User Dropdown */}
          <Dropdown align="end" className="user-dropdown-modern">
            <Dropdown.Toggle variant="link" id="dropdown-user-modern">
              <FaUserCircle size={30} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => console.log('Navigate to Profile page...')}>
                <FaUserCircle className="dropdown-icon" /> Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="dropdown-icon" /> Log out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </header>

        {/* Dynamic Content */}
        <div className="content-area">
          {renderMainContent()}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
