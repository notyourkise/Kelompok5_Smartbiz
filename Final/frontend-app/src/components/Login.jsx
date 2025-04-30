import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa"; // Mengimpor ikon FontAwesome
import "./Login.css";
import logo from "../assets/smartbizlogo.png"; // Pastikan path logo benar

const Login = () => {
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
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password,
      });

      // Menyimpan token, username, dan role di localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);  // Menyimpan username ke localStorage
      localStorage.setItem("role", response.data.role); // Menyimpan role pengguna

      // Mengarahkan berdasarkan role
      if (response.data.role === 'admin') {
        navigate("/dashboard"); // Admin menuju dashboard
      } else if (response.data.role === 'superadmin') {
        navigate("/dashboard"); // Superadmin menuju dashboard (bisa ditambahkan lebih banyak fitur nantinya)
      }

    } catch (error) {
      setErrorMessage("Login gagal. Periksa kembali username dan password.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-left">
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

            {errorMessage && <div className="error">{errorMessage}</div>}

            <button type="submit">Login</button>
          </form>

        </div>

        <div className="login-right">
          <img src={logo} alt="Smartbiz Logo" />
        </div>
      </div>
    </div>
  );
};

export default Login;
