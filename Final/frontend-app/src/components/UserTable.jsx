import React from 'react';

const UserTable = ({ users, handleDelete }) => {
  return (
    <div className="container mt-4">
      <h3 className="mb-4">Manajemen Pengguna</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map(users => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(users.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;

