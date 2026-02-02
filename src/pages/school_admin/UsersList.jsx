// src/pages/schoolAdmin/UsersList.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import "../../styles/UsersList.css";

export default function UsersList({ refresh }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/auth/school-admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  return (
    <div className="users-card">
      <h3 className="users-title">👥 Created Users</h3>

      {loading && <p className="loading">Loading...</p>}

      {!loading && users.length === 0 && (
        <p className="empty">No users created yet</p>
      )}

      {!loading && users.length > 0 && (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.full_name || "-"}</td>
                  <td>{u.username}</td>
                  <td className={`role ${u.role}`}>
                    {u.role.toUpperCase()}
                  </td>
                  <td>{u.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
