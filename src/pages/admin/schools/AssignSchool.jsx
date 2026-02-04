import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Container, Card, Form, Button, Row, Col, Alert, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AssignSchool = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [schoolId, setSchoolId] = useState("");
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [variant, setVariant] = useState("success");

  // 🔹 Fetch schools
  const fetchSchools = async () => {
    const res = await api.get("admin/schools/");
    setSchools(res.data);
  };

  // 🔹 Fetch school admins (ALL admins + assigned flag)
  const fetchAdmins = async () => {
    const res = await api.get("auth/admin/school-admins/");
    setAdmins(res.data);
  };

  // 🔹 Fetch current assignments
  const fetchAssignments = async () => {
    try {
      const res = await api.get("admin/school-admins/");
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchAdmins();
    fetchAssignments();
  }, []);

  // 🔹 Assign school admin
  const handleAssign = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!schoolId || !adminId) {
      alert("Select school and admin");
      return;
    }

    try {
      setLoading(true);
      await api.post("admin/school-admins/", {
        school: schoolId,
        user: adminId,
      });

      setMessage("✅ School Admin assigned successfully");
      setVariant("success");
      setSchoolId("");
      setAdminId("");
      fetchAdmins(); // Refresh available admins
      fetchAssignments(); // Refresh list
    } catch (err) {
      setVariant("danger");
      setMessage(err.response?.data?.detail || "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Revoke Access
  const handleRevoke = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this admin's access?")) return;
    try {
      await api.delete(`admin/school-admins/${id}/`);
      fetchAdmins();
      fetchAssignments();
    } catch (err) {
      alert("Failed to revoke access");
    }
  };

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6 mb-2">🏫 Manage Assignments</h2>
        <p className="text-secondary">Assign or revoke school admin access</p>
      </div>

      <Row className="g-5">
        {/* LEFT: ASSIGN FORM */}
        <Col lg={5}>
          <Card className="glass-card text-white h-100">
            <Card.Header className="text-center border-bottom border-light border-opacity-10 pt-4 pb-3">
              <h5 className="fw-bold mb-0">🔗 New Assignment</h5>
            </Card.Header>
            <Card.Body className="p-4 d-flex flex-column">
              {message && <Alert variant={variant} className="text-center small py-2">{message}</Alert>}

              <Form onSubmit={handleAssign} className="flex-grow-1">
                <Row className="g-4">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Select School</Form.Label>
                      <Form.Select
                        value={schoolId}
                        onChange={(e) => setSchoolId(e.target.value)}
                        required
                        className="bg-dark text-white border-secondary"
                      >
                        <option value="">-- Choose a School --</option>
                        {schools.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label>Select School Admin</Form.Label>
                      <Form.Select
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        required
                        className="bg-dark text-white border-secondary"
                      >
                        <option value="">-- Choose a User --</option>
                        {admins.map((a) => (
                          <option
                            key={a.id}
                            value={a.id}
                            disabled={a.is_assigned}
                            className={a.is_assigned ? "text-danger" : ""}
                          >
                            {a.username} {a.is_assigned ? "(Assigned)" : ""}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mt-auto pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-100 fw-bold border-0"
                      style={{ background: "linear-gradient(to right, #6366f1, #ec4899)", padding: "12px" }}
                    >
                      {loading ? "Assigning..." : "Assign & Save"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT: ASSIGNMENT LIST */}
        <Col lg={7}>
          <Card className="glass-card text-white h-100">
            <Card.Header className="border-bottom border-light border-opacity-10 pt-4 pb-3">
              <h5 className="fw-bold mb-0 ps-3">📋 Active Assignments</h5>
            </Card.Header>
            <Card.Body className="p-0 overflow-hidden rounded-bottom">
              <Table variant="dark" hover className="mb-0 align-middle">
                <thead className="text-secondary text-uppercase small bg-black">
                  <tr>
                    <th className="ps-4 py-3">School</th>
                    <th className="py-3">Admin User</th>
                    <th className="pe-4 py-3 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-secondary">No active assignments found.</td>
                    </tr>
                  ) : (
                    assignments.map((assignment) => {
                      const school = schools.find(s => s.id === assignment.school);
                      const admin = admins.find(a => a.id === assignment.user);

                      const schoolName = assignment.school_name || school?.name || "Unknown School";
                      const userName = assignment.user_name || admin?.username || "Unknown User";

                      return (
                        <tr key={assignment.id}>
                          <td className="ps-4 fw-bold text-white">{schoolName}</td>
                          <td>
                            <Badge bg="dark" className="border border-secondary text-light fw-normal px-3 py-2">
                              <i className="bi bi-person-fill me-1 text-primary"></i>
                              {userName}
                            </Badge>
                          </td>
                          <td className="text-end pe-4">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRevoke(assignment.id)}
                              title="Revoke Access"
                            >
                              <i className="bi bi-trash-fill"></i> Revoke
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AssignSchool;
