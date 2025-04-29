import React from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa'; // For Delete and Edit icons
import Footer from './Footer'; // Import the Footer component

const UserTable = ({ users, handleDelete, handleEditClick }) => {
  return (
    <div className="p-4" style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f8ff, #e1e8f0)' }}>
      
      <div className="card shadow-lg" style={{ borderRadius: '10px' }}>
        <div className="card-header text-white" style={{ backgroundColor: '#0069d9', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
          <h4 className="mb-0">Manajemen Pengguna</h4>
        </div>
        
        <div className="card-body table-responsive" style={{ padding: '20px' }}>
          <table className="table table-hover table-striped table-bordered align-middle">
            <thead style={{ backgroundColor: '#007bff', color: 'white' }}>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Role</th>
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map((user) => (
                <tr key={user.id} style={{ backgroundColor: '#f8f9fa' }}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    
                    <button
                      className="btn btn-outline-danger d-inline-flex align-items-center"
                      onClick={() => handleDelete(user.id)}
                      style={{ borderRadius: '5px', padding: '8px 16px' }}
                    >
                      <FaTrashAlt className="me-1" />
                      Hapus
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center" style={{ backgroundColor: '#e9ecef' }}>Tidak ada data pengguna.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
