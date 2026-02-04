import api from "../../api/axios";
import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col, Alert, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    phone: "",
    role: "judge",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");

  // 🔹 FETCH USERS
  const fetchUsers = async () => {
    try {
      // Trying likely endpoint for admin to get all users
      // If this fails, we might need to adjust the endpoint based on backend
      const res = await api.get("auth/admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.warn("Failed to fetch users linked to admin via auth/admin/users/", err);
      // Fallback strategies could go here if we knew other endpoints
      // For now, let's try assuming the user list might be at /admin/users or similar if the first fails
      // or we just leave the list empty and show the error in console
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      await api.post("auth/create-user/", formData);
      setMessage("✅ User created successfully");
      setVariant("success");
      setFormData({ username: "", password: "", full_name: "", phone: "", role: "judge" });
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error(err.response?.data);
      setVariant("danger");
      setMessage(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "❌ Failed to create user"
      );
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6 mb-2">👤 User Management</h2>
        <p className="text-secondary">Create and view judges & school admins</p>
      </div>

      <Row className="g-5">
        {/* LEFT: CREATE FORM */}
        <Col lg={5}>
          <Card className="glass-card text-white h-100">
            <Card.Header className="text-center border-bottom border-light border-opacity-10 pt-4 pb-3">
              <h5 className="fw-bold mb-0">➕ Create New User</h5>
            </Card.Header>
            <Card.Body className="p-4">
              {message && <Alert variant={variant} className="text-center small py-2">{message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        name="username"
                        value={formData.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        name="full_name"
                        value={formData.full_name}
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        name="phone"
                        value={formData.phone}
                        placeholder="Phone"
                        onChange={handleChange}
                        required
                        className="bg-dark text-white border-secondary"
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="bg-dark text-white border-secondary"
                      >
                        <option value="judge">Judge</option>
                        <option value="school_admin">School Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mt-4">
                    <Button
                      type="submit"
                      className="w-100 fw-bold border-0 py-3"
                      style={{ background: "linear-gradient(to right, #6366f1, #ec4899)" }}
                    >
                      Create User
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT: USER LIST */}
        <Col lg={7}>
          <Card className="glass-card text-white h-100">
            <Card.Header className="border-bottom border-light border-opacity-10 pt-4 pb-3">
              <h5 className="fw-bold mb-0 ps-3">📋 Existing Users</h5>
            </Card.Header>
            <Card.Body className="p-0 overflow-hidden rounded-bottom">
              <div className="table-responsive" style={{ maxHeight: "600px" }}>
                <Table variant="dark" hover className="mb-0 align-middle">
                  <thead className="text-secondary text-uppercase small bg-black sticky-top">
                    <tr>
                      <th className="ps-4 py-3">User</th>
                      <th className="py-3">Role</th>
                      <th className="py-3">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-5 text-secondary">No users found.</td>
                      </tr>
                    ) : (
                      users.map((u, index) => (
                        <tr key={u.id || index}>
                          <td className="ps-4">
                            <div className="fw-bold text-white">{u.full_name}</div>
                            <small className="text-secondary">@{u.username}</small>
                          </td>
                          <td>
                            <Badge
                              bg={u.role === 'judge' ? 'info' : 'warning'}
                              className="text-dark fw-bold px-3 py-2 text-uppercase"
                            >
                              {u.role?.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="text-secondary">{u.phone || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
