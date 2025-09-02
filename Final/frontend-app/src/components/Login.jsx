import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
// Removed import "./Login.css";
// Removed import logo from "../assets/smartbizlogo.png";

const Login = ({ onSwitchToRegister }) => {
  // Added onSwitchToRegister prop
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Menggunakan username
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Username dan password wajib diisi.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", response.data.role);

      if (
        response.data.role === "admin" ||
        response.data.role === "superadmin"
      ) {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage("Login gagal. Periksa kembali username dan password.");
    }
  };

  return (
    <>
      <h2>LOGIN</h2>
      <p className="sub">Area 9 Coffee Shop</p>

      <form onSubmit={handleLogin}>
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

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
