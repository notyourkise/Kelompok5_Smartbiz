import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './UserTable';

const ManageUser = () => {
  const [users, setUsers] = useState([]);

  // Ambil data user dari backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("❌ Gagal mengambil data pengguna:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hapus user
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      try {
        await axios.delete(`http://localhost:3001/api/users/${id}`);
        fetchUsers(); // Refresh data setelah hapus
      } catch (error) {
        console.error("❌ Gagal menghapus pengguna:", error);
      }
    }
  };

  return <UserTable users={users} handleDelete={handleDelete} />;
};

export default ManageUser;
