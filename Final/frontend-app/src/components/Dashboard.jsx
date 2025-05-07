import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaDollarSign, FaBed, FaCoffee, FaUser, FaBox, FaArrowLeft } from 'react-icons/fa';
import Footer from './Footer';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showFinanceSubMenu, setShowFinanceSubMenu] = useState(false);
  const [showInventarisSubMenu, setShowInventarisSubMenu] = useState(false);

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleCoffeeShopClick = () => {
    navigate('/finance/coffee-shop');
  };

  const handleKostClick = () => {
    navigate('/finance/kost');
  };

  const handleFinanceClick = () => {
    setShowFinanceSubMenu(true);
    setShowInventarisSubMenu(false);
  };

  const handleBackToDashboard = () => {
    setShowFinanceSubMenu(false);
    setShowInventarisSubMenu(false);
  };

  const handleInventarisClick = () => {
    setShowInventarisSubMenu(true);
    setShowFinanceSubMenu(false);
  };

  const handleInventarisCoffeeShopClick = () => {
    navigate('/inventaris/coffee-shop');
  };

  const handleInventarisKostClick = () => {
    navigate('/inventaris/kost');
  };

  const handleBackToDashboardInventaris = () => {
    setShowInventarisSubMenu(false);
  };

  const handleManageUser = () => {
    navigate('/manage-user');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        {(showFinanceSubMenu || showInventarisSubMenu) && (
          <FaArrowLeft className="back-icon" onClick={showFinanceSubMenu ? handleBackToDashboard : handleBackToDashboardInventaris} />
        )}
        <h2 className="dashboard-title">Smartbiz Admin</h2>
        <Button
          variant="danger"
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </Button>
      </header>

      <h3 className="welcome-message">Selamat Datang, {username}!</h3>
      <h5 className="role-display">Role: {role}</h5>

      <div className={`dashboard-grid ${showFinanceSubMenu ? 'finance-submenu-active' : ''} ${showInventarisSubMenu ? 'inventaris-submenu-active' : ''}`}>
        {role === 'superadmin' && !showFinanceSubMenu && !showInventarisSubMenu && (
          <div className="dashboard-card finance-main-card">
            <div>
              <FaDollarSign className="card-icon" style={{ color: '#2ecc71' }} />
              <h4 className="card-title">Manajemen Keuangan</h4>
              <p className="card-text">
                Kelola pemasukan dan pengeluaran bisnis Anda.
              </p>
              <Button variant="outline-primary" className="card-button" onClick={handleFinanceClick}>Kelola</Button>
            </div>
          </div>
        )}

        {role === 'superadmin' && showFinanceSubMenu && (
          <>
            <div className="dashboard-card finance-submenu-card">
              <div>
                <FaCoffee className="card-icon" style={{ color: '#a0522d' }} />
                <h4 className="card-title">Coffee Shop</h4>
                <p className="card-text">
                  Kelola keuangan Coffee Shop.
                </p>
                <Button variant="outline-primary" className="card-button" onClick={handleCoffeeShopClick}>Kelola</Button>
              </div>
            </div>

            <div className="dashboard-card finance-submenu-card">
              <div>
                <FaBed className="card-icon" style={{ color: '#3498db' }} />
                <h4 className="card-title">Kost</h4>
                <p className="card-text">
                  Kelola keuangan Kost.
                </p>
                <Button variant="outline-primary" className="card-button" onClick={handleKostClick}>Kelola</Button>
              </div>
            </div>
          </>
        )}

        {role === 'superadmin' && showInventarisSubMenu && (
          <>
            <div className="dashboard-card inventaris-submenu-card">
              <div>
                <FaCoffee className="card-icon" style={{ color: '#a0522d' }} />
                <h4 className="card-title">Inventaris Coffee Shop</h4>
                <p className="card-text">
                  Kelola inventaris Coffee Shop.
                </p>
                <Button variant="outline-primary" className="card-button" onClick={handleInventarisCoffeeShopClick}>Kelola</Button>
              </div>
            </div>

            <div className="dashboard-card inventaris-submenu-card">
              <div>
                <FaBed className="card-icon" style={{ color: '#3498db' }} />
                <h4 className="card-title">Inventaris Kost</h4>
                <p className="card-text">
                  Kelola inventaris Kost.
                </p>
                <Button variant="outline-primary" className="card-button" onClick={handleInventarisKostClick}>Kelola</Button>
              </div>
            </div>
          </>
        )}

        {role === 'superadmin' && !showFinanceSubMenu && !showInventarisSubMenu && (
          <div className="dashboard-card">
            <div>
              <FaBed className="card-icon" style={{ color: '#3498db' }} />
              <h4 className="card-title">Kamar Kos</h4>
              <p className="card-text">
                Kelola ketersediaan kamar dan pemesanan.
              </p>
              <Button variant="outline-primary" className="card-button" onClick={() => navigate('/manage-kos')}>Lihat</Button>
            </div>
          </div>
        )}

{!showFinanceSubMenu && !showInventarisSubMenu && (
  <div className="dashboard-card">
    <div>
      <FaCoffee className="card-icon" style={{ color: '#a0522d' }} />
      <h4 className="card-title">Area 9 - Coffee Shop</h4>
      <p className="card-text">
        Klik untuk melihat menu kopi dan melakukan pemesanan.
      </p>
      {/* Mengarahkan ke halaman manage coffee shop menu */}
      <Button 
        variant="outline-primary" 
        className="card-button" 
        onClick={() => navigate('/manage-coffee-shop-menu')}
      >
        Lihat Menu
      </Button>
    </div>
  </div>
)}

        {role === 'superadmin' && !showFinanceSubMenu && !showInventarisSubMenu && (
          <div className="dashboard-card">
            <div>
              <FaUser className="card-icon" style={{ color: '#f39c12' }} />
              <h4 className="card-title">Manajemen User</h4>
              <p className="card-text">
                Kelola data pengguna anda .
              </p>
              <Button variant="outline-primary" className="card-button" onClick={handleManageUser}>Kelola</Button>
            </div>
          </div>
        )}

        {role === 'superadmin' && !showFinanceSubMenu && !showInventarisSubMenu && (
          <div className="dashboard-card inventaris-main-card">
            <div>
              <FaBox className="card-icon" style={{ color: '#95a5a6' }} />
              <h4 className="card-title">Manajemen Inventaris</h4>
              <p className="card-text">
                Kelola stok dan inventaris bisnis Anda.
              </p>
              <Button variant="outline-primary" className="card-button" onClick={handleInventarisClick}>Kelola</Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
