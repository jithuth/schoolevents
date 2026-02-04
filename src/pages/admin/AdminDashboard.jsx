import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Container className="py-5" style={{ minHeight: "80vh" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold display-4">👑 Admin Dashboard</h1>
        <p className="text-secondary lead">Manage users, schools & assignments</p>
      </div>

      <Row xs={1} md={3} className="g-4">
        <Col>
          <DashboardCard
            title="Create Users"
            desc="Create judges & school admins"
            icon="bi-person-plus-fill"
            onClick={() => navigate("/admin/create-user")}
          />
        </Col>

        <Col>
          <DashboardCard
            title="Manage Schools"
            desc="Create, update & delete schools"
            icon="bi-building-fill"
            onClick={() => navigate("/admin/schools")}
          />
        </Col>

        <Col>
          <DashboardCard
            title="Assign School"
            desc="Assign school to school admin"
            icon="bi-person-workspace"
            onClick={() => navigate("/admin/assign-school")}
          />
        </Col>
      </Row>
    </Container>
  );
}

function DashboardCard({ title, desc, icon, onClick }) {
  return (
    <Card
      onClick={onClick}
      className="glass-card text-white h-100 border-0 shadow-sm"
      style={{ cursor: "pointer", transition: "transform 0.2s" }}
      onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
      onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <Card.Body className="text-center p-4 d-flex flex-column justify-content-center align-items-center">
        <div className="mb-3 rounded-circle bg-dark d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
          <i className={`bi ${icon} text-gradient fs-2`}></i>
        </div>
        <Card.Title className="fw-bold fs-4">{title}</Card.Title>
        <Card.Text className="text-secondary small">{desc}</Card.Text>
      </Card.Body>
    </Card>
  );
}
