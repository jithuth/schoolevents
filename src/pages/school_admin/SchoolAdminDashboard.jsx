// src/pages/schoolAdmin/SchoolAdminDashboard.jsx
import { useState } from "react";
import CreateUser from "./CreateUser";
import UsersList from "./UsersList";
import StudentsList from "./StudentsList";
import TeachersList from "./TeachersList";
import "../../styles/SchoolAdminDashboard.css";

export default function SchoolAdminDashboard() {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [refreshUsers, setRefreshUsers] = useState(false);

  return (
    <div className="admin-page">
      <h2 className="admin-title">🏫 School Admin Dashboard</h2>

      {/* CREATE USER */}
      <div className="admin-card">
        <div className="card-header">
          <h3>Create User Account</h3>

          <button
            className="primary-btn"
            onClick={() => setShowCreateUser(!showCreateUser)}
          >
            {showCreateUser ? "Close" : "➕ Create User"}
          </button>
        </div>

        {showCreateUser && (
          <div className="card-body">
            <CreateUser
              onDone={() => {
                setShowCreateUser(false);
                setRefreshUsers(!refreshUsers); // 🔥 refresh table
              }}
            />
          </div>
        )}
      </div>

      {/* 👇 IDI AKKADA — CREATED USERS TABLE */}
      <div className="admin-card">
        <UsersList refresh={refreshUsers} />
      </div>

      {/* STUDENTS */}
      <div className="admin-card">
        <StudentsList />
      </div>

      {/* TEACHERS */}
      <div className="admin-card">
        <TeachersList />
      </div>
    </div>
  );
}
