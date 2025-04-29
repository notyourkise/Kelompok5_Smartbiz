import React, { useState, useEffect } from "react";
import axios from "axios";
import UserTable from "./UserTable";
import { Button, Modal, Form } from "react-bootstrap"; // Import Bootstrap components
import { FaPlus, FaEdit, FaArrowLeft } from "react-icons/fa"; // Import Plus, Edit, and ArrowLeft icons
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Footer from './Footer'; // Import the Footer component

const ManageUser = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  // Handle deleting user
  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token not found. Please log in again.");
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error(
        "Error deleting user:",
        error.response ? error.response.data : error.message
      );
    }
  };
  
  return (
    <div className="container-fluid mt-4">
      {/* Back Button */}
      <div className="d-flex justify-content-start mb-3">
        {/* Back button with custom styling to match Dashboard Logout button */}
        <Button 
          variant="secondary" 
          onClick={handleBack} 
          style={{
            width: '45px', // Adjusted width for just the icon
            height: '45px',
            padding: '0',
            borderRadius: '10px',
            display: 'flex', // Use flex to center the icon
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <FaArrowLeft /> 
        </Button>
      </div>

      {/* User Table */}
      <UserTable
        users={users}
        handleDelete={handleDelete}
        handleEditClick={handleEditClick}
      />

      {/* Include the Footer component */}
      <Footer />

      {/* Create User Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
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
    </div>
  );
};

export default ManageUser;
