import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
// Import Table component from react-bootstrap
import { Button, Modal, Form, Table, Alert } from "react-bootstrap";
import {
  FaTrashAlt,
  FaEdit,
  FaPlus,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa"; // Import necessary icons
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Footer from "./Footer"; // Import the Footer component
import "./ManageUser.css"; // Import the new CSS file
import "./SuccessModal.css"; // Import the success modal CSS

const ManageUser = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from API
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot fetch users.");
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to navigate back to the dashboard
  const handleBack = () => {
    navigate("/dashboard"); // Navigate to Dashboard
  };
  // Handle input changes for new user form
  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });

    // Clear validation error when user types in any field
    if (validationError) {
      // Only clear error if all fields are filled
      const updatedUser = { ...newUser, [name]: value };
      if (updatedUser.username && updatedUser.password && updatedUser.role) {
        setValidationError("");
      }
    }
  };

  // Handle input changes for edit user form
  const handleEditingUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });

    // Clear validation error when user types in any field
    if (validationError) {
      // Only clear error if all fields are filled
      const updatedUser = { ...editingUser, [name]: value };
      if (updatedUser.username && updatedUser.role && (updatedUser.password || !editingUser.password)) {
        setValidationError("");
      }
    }
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot create user.");
      return;
    }
    // Validasi semua field required telah diisi
    if (!newUser.username || !newUser.password || !newUser.role) {
      setValidationError(
        "Mohon isi semua kolom yang ditandai dengan tanda bintang (*) untuk menambahkan pengguna."
      );
      return;
    }

    // Validate role
    if (newUser.role.toLowerCase() !== "admin" && newUser.role.toLowerCase() !== "superadmin") {
      setValidationError("Role harus diisi dengan role admin atau superadmin.");
      return;
    }

    // Validate username uniqueness
    const isUsernameTaken = users.some(
      (user) => user.username.toLowerCase() === newUser.username.toLowerCase()
    );
    if (isUsernameTaken) {
      setValidationError("Username sudah digunakan. Silakan gunakan username lain.");
      return;
    }

    // Reset error message if validation passes
    setValidationError("");

    try {
      await axios.post(`${API_URL}/api/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCreateModal(false);
      setNewUser({ username: "", password: "", role: "" });
      fetchUsers(); // Refresh user list after successful creation

      // Show success message
      setSuccessMessage("Pengguna berhasil ditambahkan!");
      setShowSuccessModal(true);

      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        fetchUsers();
      }, 2000);
    } catch (error) {
      console.error(
        "Error creating user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle opening the edit modal
  const handleEditClick = (user) => {
    setEditingUser({ ...user, password: "" });
    setShowEditModal(true);
    setValidationError(""); // Reset validation error when opening modal
  };

  // Handle updating user details
  const handleUpdateUser = async () => {
    const token = localStorage.getItem("token");
    if (!token || !editingUser) {
      console.error(
        "Authentication token or editing user data not found. Cannot update user."
      );
      return;
    }

    // Validate role
    if (editingUser.role.toLowerCase() !== "admin" && editingUser.role.toLowerCase() !== "superadmin") {
      setValidationError("Role harus diisi dengan role admin atau superadmin.");
      return;
    }

    // Validate username uniqueness (excluding the current user being edited)
    const isUsernameTaken = users.some(
      (user) =>
        user.id !== editingUser.id &&
        user.username.toLowerCase() === editingUser.username.toLowerCase()
    );
    if (isUsernameTaken) {
      setValidationError("Username sudah digunakan. Silakan gunakan username lain.");
      return;
    }

    // Reset error message if validation passes
    setValidationError("");

    try {
      const updateData = {
        username: editingUser.username,
        role: editingUser.role,
      };
      if (editingUser.password) {
        updateData.password = editingUser.password;
      }

      await axios.put(`${API_URL}/api/users/${editingUser.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers(); // Refresh user list after successful update

      // Show success message
      setSuccessMessage("Pengguna berhasil diperbarui!");
      setShowSuccessModal(true);

      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        fetchUsers();
      }, 2000);
    } catch (error) {
      console.error(
        "Error updating user:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Handle showing delete confirmation modal
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirmModal(true);
  };

  // Handle deleting user after confirmation
  const handleDeleteConfirm = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userToDelete) {
      console.error(
        "Authentication token or user to delete not found. Please log in again."
      );
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);

      // Show success message
      setSuccessMessage("Pengguna berhasil dihapus!");
      setShowSuccessModal(true);

      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
    }
  };

  return (
    // Use the new container class
    <div className="manage-user-container">
      {/* Header with Back Button and Title */}
      <header className="manage-user-header">
        {/* Back Button with CSS class */}
        <h2 className="manage-user-title">Manajemen Pengguna</h2>{" "}
        {/* Add title */}
        {/* Create User Button */}{" "}
        <Button
          variant="primary" // Keep variant for base styling, override with class
          onClick={() => {
            setShowCreateModal(true);
            setValidationError(""); // Reset validation error when opening modal
          }}
          className="action-button" // Apply CSS class
        >
          <FaPlus /> Tambah Pengguna
        </Button>
      </header>

      {/* User Table */}
      <div className="table-responsive">
        {/* Make table responsive */}
        <Table striped bordered hover className="user-table">
          {/* Add class for potential styling */}
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditClick(user)}
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <FaTrashAlt /> Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Tidak ada data pengguna.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Create User Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setValidationError("");
        }}
      >
        {" "}
        <Modal.Header closeButton>
          <Modal.Title>Tambah Pengguna Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validationError && (
            <Alert
              variant="danger"
              onClose={() => setValidationError("")}
              dismissible
            >
              {validationError}
            </Alert>
          )}
          <p style={{ color: "white" }} className="small mb-2">
            Kolom dengan tanda <span className="text-danger">*</span> wajib
            diisi
          </p>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3">
              <Form.Label>
                Username <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleNewUserInputChange}
                placeholder="Masukkan Username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Password <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleNewUserInputChange}
                placeholder="Masukkan Password"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Role <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={newUser.role}
                onChange={handleNewUserInputChange}
                placeholder="Masukkan Role"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {" "}
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreateModal(false);
              setValidationError("");
            }}
          >
            Batal
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setValidationError(""); // Reset validation error when closing modal
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {validationError && (
            <Alert
              variant="danger"
              onClose={() => setValidationError("")}
              dismissible
            >
              {validationError}
            </Alert>
          )}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={editingUser?.username || ""}
                onChange={handleEditingUserInputChange}
                placeholder="Edit Username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Password (Kosongkan jika tidak ingin mengubah)
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={editingUser?.password || ""}
                onChange={handleEditingUserInputChange}
                placeholder="Edit Password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={editingUser?.role || ""}
                onChange={handleEditingUserInputChange}
                placeholder="Edit Role"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirmModal}
        onHide={() => setShowDeleteConfirmModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus pengguna "{userToDelete?.username}"?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Hapus{" "}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        className="success-modal"
      >
        <Modal.Body className="text-center p-4">
          <div className="success-checkmark-container">
            <FaCheckCircle className="success-checkmark-icon" />
          </div>{" "}
          <h4 className="mt-3">{successMessage}</h4>
        </Modal.Body>{" "}
      </Modal>

      {/* Hapus pemanggilan Footer di sini karena sudah dihandle oleh Dashboard */}
    </div>
  );
};

export default ManageUser;
