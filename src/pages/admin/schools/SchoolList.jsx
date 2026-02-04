import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Container, Row, Col, Card, Form, Button, Table, Badge, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_URL = "admin/schools/";

const emptyForm = {
  name: "",
  school_code: "",
  board: "",
  city: "",
  state: "",
  country: "",
  principal_name: "",
  contact_email: "",
  contact_phone: "",
  established_year: "",
};

const SchoolList = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 FETCH
  const fetchSchools = async () => {
    try {
      setLoading(true);
      const res = await api.get(API_URL);
      setSchools(res.data);
    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // 🔹 ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editId) {
        await api.put(`${API_URL}${editId}/`, formData);
      } else {
        await api.post(API_URL, formData);
      }

      setFormData(emptyForm);
      setEditId(null);
      fetchSchools();
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
      alert("All fields are required or invalid input");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 EDIT
  const handleEdit = (s) => {
    setFormData({
      name: s.name || "",
      school_code: s.school_code || "",
      board: s.board || "",
      city: s.city || "",
      state: s.state || "",
      country: s.country || "",
      principal_name: s.principal_name || "",
      contact_email: s.contact_email || "",
      contact_phone: s.contact_phone || "",
      established_year: s.established_year || "",
    });
    setEditId(s.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this school?")) return;
    await api.delete(`${API_URL}${id}/`);
    fetchSchools();
  };

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold display-6 mb-1">🏫 Schools Management</h2>
          <p className="text-secondary">Create and manage school entities</p>
        </div>
      </div>

      <Row className="g-5">
        {/* FORM SECTION */}
        <Col lg={12}>
          <Card className="glass-card text-white mb-5">
            <Card.Header className="py-3 border-light border-opacity-10">
              <h5 className="mb-0 fw-bold">{editId ? "✏️ Edit School" : "➕ Add New School"}</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  {[
                    ["School Name", "name", 6],
                    ["School Code", "school_code", 3],
                    ["Board", "board", 3],
                    ["City", "city", 4],
                    ["State", "state", 4],
                    ["Country", "country", 4],
                    ["Principal Name", "principal_name", 4],
                    ["Contact Email", "contact_email", 4, "email"],
                    ["Contact Phone", "contact_phone", 4, "tel"],
                    ["Established Year", "established_year", 3, "number"],
                  ].map(([label, key, colSize, type]) => (
                    <Col md={colSize || 4} key={key}>
                      <Form.Group>
                        <Form.Label className="small text-secondary">{label}</Form.Label>
                        <Form.Control
                          type={type || "text"}
                          placeholder={label}
                          value={formData[key]}
                          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                          required
                          className="bg-dark text-white border-secondary"
                        />
                      </Form.Group>
                    </Col>
                  ))}

                  <Col xs={12} className="mt-4 d-flex gap-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="px-5 fw-bold border-0"
                      style={{ background: editId ? "orange" : "linear-gradient(to right, #6366f1, #ec4899)" }}
                    >
                      {submitting ? <Spinner size="sm" /> : (editId ? "Update School" : "Add School")}
                    </Button>

                    {editId && (
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditId(null);
                          setFormData(emptyForm);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* LIST SECTION */}
        <Col lg={12}>
          <Card className="glass-card text-white border-0">
            <Card.Body className="p-0 overflow-hidden rounded-3">
              <Table hover variant="dark" responsive className="mb-0 align-middle">
                <thead className="bg-black text-secondary text-uppercase small">
                  <tr>
                    <th className="p-3">School Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Board</th>
                    <th className="p-3">Principal</th>
                    <th className="p-3 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  ) : schools.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-secondary">No schools found.</td>
                    </tr>
                  ) : (
                    schools.map((s) => (
                      <tr key={s.id}>
                        <td className="p-3 fw-bold text-white">{s.name} <br /><small className="text-secondary opacity-75">{s.school_code}</small></td>
                        <td className="p-3">{s.city}, {s.state}</td>
                        <td className="p-3"><Badge bg="info" className="text-dark">{s.board}</Badge></td>
                        <td className="p-3">{s.principal_name}</td>
                        <td className="p-3 text-end">
                          <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEdit(s)}>
                            <i className="bi bi-pencil-fill"></i>
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => handleDelete(s.id)}>
                            <i className="bi bi-trash-fill"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
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

export default SchoolList;
