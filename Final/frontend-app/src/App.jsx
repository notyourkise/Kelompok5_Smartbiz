import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register"; // Pastikan komponen Register diimpor dengan benar
import Dashboard from "./components/Dashboard";  // Komponen Dashboard
import ManageUser from "./components/ManageUser";
import ManageInventaris from "./components/ManageInventaris";  // Pastikan komponen ManageInventaris diimpor
import ManageCoffeeShopFinance from "./components/ManageCoffeeShopFinance"; // Import komponen ManageCoffeeShopFinance
import ManageKostFinance from "./components/ManageKostFinance"; // Import komponen ManageKostFinance
import 'bootstrap/dist/css/bootstrap.min.css';  // Pastikan Bootstrap diimpor

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-user" element={<ManageUser />} /> {/* Route untuk Manage User */}
          <Route path="/manage-inventaris" element={<ManageInventaris />} /> {/* Route untuk Manage Inventaris */}
          <Route path="/finance/coffee-shop" element={<ManageCoffeeShopFinance />} /> {/* Route untuk Manajemen Keuangan Coffee Shop */}
          <Route path="/finance/kost" element={<ManageKostFinance />} /> {/* Route untuk Manajemen Keuangan Kost */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
