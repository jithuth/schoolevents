// src/pages/schoolAdmin/SchoolAdminDashboard.jsx
import { useState } from "react";
import CreateUser from "./CreateUser";
import UsersList from "./UsersList";
import StudentsList from "./StudentsList";
import TeachersList from "./TeachersList";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function SchoolAdminDashboard() {
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [refreshUsers, setRefreshUsers] = useState(false);

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold display-5 text-white">🏫 School Admin Dashboard</h2>
          <p className="text-secondary">Manage your school, staff, and students</p>
        </div>
      </div>

      <Row className="gy-5">
        {/* CREATE USER CARD */}
        <Col xs={12}>
          <Card className="glass-card text-white">
            <Card.Header className="d-flex justify-content-between align-items-center border-bottom border-white border-opacity-10 py-3">
              <h4 className="mb-0 fw-bold">User Management</h4>
              <Button
                variant={showCreateUser ? "secondary" : "primary"}
                onClick={() => setShowCreateUser(!showCreateUser)}
                className="rounded-pill px-4 fw-bold"
                style={!showCreateUser ? { background: "linear-gradient(to right, #6366f1, #ec4899)", border: "none" } : {}}
              >
                {showCreateUser ? "Close Form" : "➕ Create User"}
              </Button>
            </Card.Header>
            {showCreateUser && (
              <Card.Body>
                <CreateUser
                  onDone={() => {
                    setShowCreateUser(false);
                    setRefreshUsers(!refreshUsers);
                  }}
                />
              </Card.Body>
            )}
          </Card>
        </Col>

        {/* USERS LIST */}
        <Col xs={12}>
          <Card className="glass-card text-white p-3">
            <Card.Title className="mb-4 ps-2 fw-bold text-primary">Staff & Judges</Card.Title>
            <UsersList refresh={refreshUsers} />
          </Card>
        </Col>

        {/* STUDENTS */}
        <Col lg={6}>
          <Card className="glass-card text-white p-3 h-100">
            <Card.Title className="mb-4 ps-2 fw-bold text-info">Students</Card.Title>
            <StudentsList />
          </Card>
        </Col>

        {/* TEACHERS */}
        <Col lg={6}>
          <Card className="glass-card text-white p-3 h-100">
            <Card.Title className="mb-4 ps-2 fw-bold text-warning">Teachers</Card.Title>
            <TeachersList />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
