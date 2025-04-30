// src/components/Register.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Keep Modal and Button for the popup
import { FaCheckCircle, FaUser, FaLock } from "react-icons/fa"; // Import necessary icons
import "./Register.css"; // Ensure CSS is imported
import logo from "../assets/smartbizlogo.png"; // Pastikan path logo benar

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin"); // Add state for role, default to 'admin'
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State untuk modal

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword || !role) { // Add role validation
      setErrorMessage("Semua kolom harus diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
        role, // Include role in the request payload
      });

      // Tampilkan modal setelah berhasil register
      setShowModal(true);
    } catch (error) {
      setErrorMessage("Gagal mendaftar. Coba lagi.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/login"); // Arahkan ke halaman login setelah modal ditutup
  };

  return (
    <div className="auth-container"> 
      {/* Use the split card class */}
      <div className="auth-card-split"> 
        {/* Image Section (Left) */}
        <div className="auth-image-section"> 
          <img src={logo} alt="Smartbiz Logo" className="auth-logo" /> 
        </div>

        {/* Form Section (Right) */}
        <div className="auth-form-section"> 
          <h2>REGISTER</h2>
          <p className="sub">Area 9 Coffee Shop</p>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Username</label>
              <div className="input-icon">
                <FaUser /> {/* Add icon */}
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-icon">
                <FaLock /> {/* Add icon */}
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-icon">
                <FaLock /> {/* Add icon */}
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Role</label>
              <div className="input-icon">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
            </div>

            {/* Apply consistent error message class */}
            {errorMessage && <div className="error-message">{errorMessage}</div>} 

            {/* Apply new button class */}
            <button type="submit" className="auth-button">Register</button> 
          </form>

          {/* Use consistent link style */}
          <p className="switch-auth-link"> 
            Sudah punya akun? <a href="/login">Login</a>
          </p>
        </div> 
      </div>

      {/* Modal Pop-up remains outside the split card */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheckCircle style={{ color: "green", fontSize: "2rem" }} />{" "}
            {/* Green Check Icon */}
            Registrasi Berhasil!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Akun Anda berhasil dibuat. Silakan login untuk melanjutkan.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={closeModal}>
            OK
          </Button>
          <Button variant="outline-secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
