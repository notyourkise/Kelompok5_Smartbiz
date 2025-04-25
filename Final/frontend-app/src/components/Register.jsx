// src/components/Register.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa"; // Pastikan ikon FaCheckCircle diimpor
import "./Register.css";
import logo from "../assets/smartbizlogo.png"; // Pastikan path logo benar

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false); // State untuk modal

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
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
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-left">
          <h2>REGISTER</h2>
          <p className="sub">Area 9 Coffee Shop</p>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Username</label>
              <div className="input-icon">
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
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {errorMessage && <div className="error">{errorMessage}</div>}

            <button type="submit">Register</button>
          </form>

          <p className="mt-3 text-center">
            Sudah punya akun? <a href="/login">Login</a>
          </p>
        </div>

        <div className="register-right">
          <img src={logo} alt="Smartbiz Logo" />
        </div>
      </div>

      {/* Modal Pop-up */}
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
