import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register"; // Pastikan komponen Register diimpor dengan benar
import Dashboard from "./components/Dashboard";  // Komponen Dashboard
import ManageUser from "./components/ManageUser";
import 'bootstrap/dist/css/bootstrap.min.css';  // Pastikan Bootstrap diimpor
import Footer from './components/Footer';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
