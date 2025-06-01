// src/components/Register.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle, FaUser, FaLock } from "react-icons/fa";
// Removed import "./Register.css";
// Removed import logo from "../assets/smartbizlogo.png";

const Register = ({ onSwitchToLogin }) => { // Added onSwitchToLogin prop
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Removed role state: const [role, setRole] = useState("admin"); 
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Removed role from validation: if (!username || !password || !confirmPassword || !role) {
    if (!username || !password || !confirmPassword) { 
      setErrorMessage("Semua kolom harus diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak cocok.");
      return;
    }

    try {
      // Hardcode role to 'admin' in the request payload
      await axios.post("http://localhost:3001/auth/register", {
        username,
        password,
        role: 'admin', 
      });
      setShowModal(true);
    } catch (error) {
      if (error.response && error.response.status === 409) { // Assuming 409 Conflict for duplicate username
        setErrorMessage("Username sudah digunakan. Silakan gunakan username lain.");
      } else {
        setErrorMessage("Gagal mendaftar. Coba lagi.");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Instead of navigating, call the switch function if available,
    // or let AuthPage handle navigation after successful registration.
    // For now, we'll just close the modal. AuthPage will handle the view.
    if (onSwitchToLogin) {
      onSwitchToLogin(); // This will trigger the slide back to login
    } else {
      navigate('/login'); // Fallback if prop not passed, though AuthPage should handle it
    }
  };

  return (
    <>
      <h2>REGISTER</h2>
      <p className="sub">Area 9 Coffee Shop</p>

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username</label>
          <div className="input-icon">
            <FaUser />
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
            <FaLock />
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
            <FaLock />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {/* Removed Role selection form group */}
        {/* <div className="form-group"> ... </div> */}

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit" className="auth-button">Register</button>
      </form>

      

      {/* Modal Pop-up remains part of this component but styled by AuthPage.css */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaCheckCircle style={{ color: "green", fontSize: "2rem" }} />{" "}
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Register;
