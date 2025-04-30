import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap'; // Menggunakan Bootstrap
import { FaDollarSign, FaBed, FaCoffee, FaUser, FaBox } from 'react-icons/fa'; // Menggunakan React Icons
import Footer from './Footer'; // Import the Footer component

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
    <div className="container-fluid p-4" style={{ height: '100vh', backgroundColor: '#2c3e50' }}>
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: 'white' }}>Smartbiz Admin</h2>
        {/* Tombol Logout */}
        <Button 
          variant="danger" 
          onClick={handleLogout} 
          size="sm" 
          style={{
            width: '100px',
            height: '40px',
            padding: '0',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Logout
        </Button>
      </header>

      {/* Welcome Message */}
      <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>Selamat Datang, {username}!</h3>
      <h5 style={{ color: 'white', textAlign: 'center' }}>Role: {role}</h5>

      {/* Grid Layout untuk Menu Dashboard */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4 justify-content-center">
        {/* Manajemen Keuangan Card - Hanya untuk Superadmin */}
        {role === 'superadmin' && (
          <Col>
            <Card className="text-center shadow p-3 mb-5 rounded">
              <Card.Body>
                <FaDollarSign style={{ fontSize: '3rem', color: '#f39c12' }} />
                <Card.Title>Manajemen Keuangan</Card.Title>
                <Card.Text>
                  Kelola pemasukan dan pengeluaran bisnis Anda.
                </Card.Text>
                <Button variant="outline-primary" className="w-100">Kelola</Button>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Kamar Kos Card - Hanya untuk Superadmin */}
        {role === 'superadmin' && (
          <Col>
            <Card className="text-center shadow p-3 mb-5 rounded">
              <Card.Body>
                <FaBed style={{ fontSize: '3rem', color: '#2ecc71' }} />
                <Card.Title>Kamar Kos</Card.Title>
                <Card.Text>
                  Kelola ketersediaan kamar dan pemesanan.
                </Card.Text>
                <Button variant="outline-primary" className="w-100">Lihat</Button>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Area 9 - Coffee Shop Card - Untuk Semua Role */}
        <Col>
          <Card className="text-center shadow p-3 mb-5 rounded">
            <Card.Body>
              <FaCoffee style={{ fontSize: '3rem', color: '#e67e22' }} />
              <Card.Title>Area 9 - Coffee Shop</Card.Title>
              <Card.Text>
                Klik untuk melihat menu kopi dan melakukan pemesanan.
              </Card.Text>
              <Button variant="outline-primary" className="w-100">Lihat Menu</Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Manajemen User Card - Hanya untuk Superadmin */}
        {role === 'superadmin' && (
          <Col>
            <Card className="text-center shadow p-3 mb-5 rounded">
              <Card.Body>
                <FaUser style={{ fontSize: '3rem', color: '#3498db' }} />
                <Card.Title>Manajemen User</Card.Title>
                <Card.Text>
                  Kelola data pengguna (CRUD).
                </Card.Text>
                <Button variant="outline-primary" className="w-100" onClick={handleManageUser}>Kelola</Button>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Inventaris Bisnis Card - Hanya untuk Superadmin */}
        {role === 'superadmin' && (
          <Col>
            <Card className="text-center shadow p-3 mb-5 rounded">
              <Card.Body>
                <FaBox style={{ fontSize: '3rem', color: '#9b59b6' }} />
                <Card.Title>Inventaris Bisnis</Card.Title>
                <Card.Text>
                  Kelola stok dan inventaris bisnis Anda.
                </Card.Text>
                <Button variant="outline-primary" className="w-100" onClick={handleInventaris}>Kelola Inventaris</Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Include the Footer component */}
      <Footer /> 
    </div>
  );
};

export default Dashboard;
