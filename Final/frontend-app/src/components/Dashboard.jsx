import React from 'react';
import { useNavigate } from 'react-router-dom';
// Remove Bootstrap components Card, Row, Col. Keep Button for now or replace later if needed.
import { Button } from 'react-bootstrap'; 
import { FaDollarSign, FaBed, FaCoffee, FaUser, FaBox } from 'react-icons/fa'; // Menggunakan React Icons
import Footer from './Footer'; // Import the Footer component
import './Dashboard.css'; // Import the new CSS file

const Dashboard = () => {
  const navigate = useNavigate();

  // Ambil username dan role dari localStorage
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');  // Ambil role dari localStorage

  const handleLogout = () => {
    // Menghapus token, username, dan role dari localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    // Arahkan ke halaman login
    navigate('/login');
  };

  const handleManageUser = () => {
    navigate('/manage-user'); // Arahkan ke halaman Manage User
  };

  const handleInventaris = () => {
    navigate('/inventaris'); // Arahkan ke halaman Inventaris Bisnis
  };

  return (
    // Use CSS classes instead of inline styles and Bootstrap container
    <div className="dashboard-container"> 
      {/* Header */}
      <header className="dashboard-header"> 
        <h2 className="dashboard-title">Smartbiz Admin</h2> 
        {/* Tombol Logout with CSS class */}
        <Button 
          variant="danger" // Keep variant for base styling, override with class
          onClick={handleLogout} 
          className="logout-button" // Apply CSS class
        >
          Logout
        </Button>
      </header>

      {/* Welcome Message */}
      <h3 className="welcome-message">Selamat Datang, {username}!</h3> 
      <h5 className="role-display">Role: {role}</h5> 

      {/* Grid Layout untuk Menu Dashboard - Use div with CSS class */}
      <div className="dashboard-grid"> 
        {/* Manajemen Keuangan Card - Hanya untuk Superadmin */}
        {role === 'superadmin' && (
          // Replace Col and Card with div and CSS classes
          <div className="dashboard-card"> 
            {/* Replace Card.Body */}
            <div>
              {/* Apply icon class and specific color */}
              <FaDollarSign className="card-icon" style={{ color: '#2ecc71' }} /> {/* Green for finance */}
              <h4 className="card-title">Manajemen Keuangan</h4>
              <p className="card-text">
                Kelola pemasukan dan pengeluaran bisnis Anda.
              </p>
              {/* Apply button class */}
              <Button variant="outline-primary" className="card-button">Kelola</Button> 
            </div>
          </div>
        )}

        {/* Kamar Kos Card - Hanya untuk Superadmin */}
        {role === 'superadmin' && (
          <div className="dashboard-card">
            <div>
              {/* Apply icon class and specific color */}
              <FaBed className="card-icon" style={{ color: '#3498db' }} /> {/* Blue for rooms */}
              <h4 className="card-title">Kamar Kos</h4>
              <p className="card-text">
                Kelola ketersediaan kamar dan pemesanan.
              </p>
              <Button variant="outline-primary" className="card-button">Lihat</Button>
            </div>
          </div>
        )}

        {/* Area 9 - Coffee Shop Card - Untuk Semua Role */}
        <div className="dashboard-card">
          <div>
            {/* Apply icon class and specific color */}
            <FaCoffee className="card-icon" style={{ color: '#a0522d' }} /> {/* Brown for coffee */}
            <h4 className="card-title">Area 9 - Coffee Shop</h4>
            <p className="card-text">
              Klik untuk melihat menu kopi dan melakukan pemesanan.
            </p>
            <Button variant="outline-primary" className="card-button">Lihat Menu</Button>
          </div>
        </div>

        {/* Manajemen User Card - Hanya untuk Superadmin */}
        {role === 'superadmin' && (
          <div className="dashboard-card">
            <div>
              {/* Apply icon class and specific color */}
              <FaUser className="card-icon" style={{ color: '#f39c12' }} /> {/* Orange for users */}
              <h4 className="card-title">Manajemen User</h4>
              <p className="card-text">
                Kelola data pengguna anda .
              </p>
              <Button variant="outline-primary" className="card-button" onClick={handleManageUser}>Kelola</Button>
            </div>
          </div>
        )}

        {/* Inventaris Bisnis Card - Hanya untuk Superadmin */}
        {role === 'superadmin' && (
          <div className="dashboard-card">
            <div>
              {/* Apply icon class and specific color */}
              <FaBox className="card-icon" style={{ color: '#95a5a6' }} /> {/* Gray for inventory */}
              <h4 className="card-title">Inventaris Bisnis</h4>
              <p className="card-text">
                Kelola stok dan inventaris bisnis Anda.
              </p>
              <Button variant="outline-primary" className="card-button" onClick={handleInventaris}>Kelola Inventaris</Button>
            </div>
          </div>
        )}
      </div> 

      {/* Include the Footer component */}
      <Footer /> 
    </div>
  );
};

export default Dashboard;
