import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={container}>
      <h1>👑 Admin Dashboard</h1>
      <p>Manage users, schools & assignments</p>

      <div style={grid}>
        <DashboardCard
          title="Create Users"
          desc="Create judges & school admins"
          onClick={() => navigate("/admin/create-user")}
        />

        <DashboardCard
          title="Manage Schools"
          desc="Create, update & delete schools"
          onClick={() => navigate("/admin/schools")}
        />

        <DashboardCard
          title="Assign School"
          desc="Assign school to school admin"
          onClick={() => navigate("/admin/assign-school")}
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, desc, onClick }) {
  return (
    <div style={card} onClick={onClick}>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

const container = { padding: "40px" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "30px",
};

const card = {
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  cursor: "pointer",
  background: "#f9f9f9",
};
