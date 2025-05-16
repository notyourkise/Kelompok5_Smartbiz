import React, { useState, useEffect } from "react";
import axios from "axios";
// Import Table component from react-bootstrap
import { Button, Modal, Form, Table } from "react-bootstrap";
import { FaTrashAlt, FaEdit, FaPlus, FaArrowLeft } from "react-icons/fa"; // Import necessary icons
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Footer from "./Footer"; // Import the Footer component
import "./ManageUser.css"; // Import the new CSS file

const ManageUser = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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
      const response = await axios.get("http://localhost:3001/api/users", {
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
  };

  // Handle input changes for edit user form
  const handleEditingUserInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Cannot create user.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCreateModal(false);
      setNewUser({ username: "", password: "", role: "" });
      fetchUsers();
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
    try {
      const updateData = {
        username: editingUser.username,
        role: editingUser.role,
      };
      if (editingUser.password) {
        updateData.password = editingUser.password;
      }

      await axios.put(
        `http://localhost:3001/api/users/${editingUser.id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
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
      console.error("Authentication token or user to delete not found. Please log in again.");
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/api/users/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setShowDeleteConfirmModal(false);
      setUserToDelete(null);
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
        {/* Create User Button */}
        <Button
          variant="primary" // Keep variant for base styling, override with class
          onClick={() => setShowCreateModal(true)}
          className="action-button" // Apply CSS class
        >
          <FaPlus /> Tambah Pengguna
        </Button>
      </header>

      {/* User Table */}
      <div className="table-responsive">
        {" "}
        {/* Make table responsive */}
        <Table striped bordered hover className="user-table">
          {" "}
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
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2" // Margin end for spacing
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

      {/* Include the Footer component */}
      <Footer />

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(true)}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Pengguna Baru</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleNewUserInputChange}
                placeholder="Masukkan Username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleNewUserInputChange}
                placeholder="Masukkan Password"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={newUser.role}
                onChange={handleNewUserInputChange}
                placeholder="Masukkan Role"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
      <Modal show={showDeleteConfirmModal} onHide={() => setShowDeleteConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Apakah Anda yakin ingin menghapus pengguna "{userToDelete?.username}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmModal(false)}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageUser;
