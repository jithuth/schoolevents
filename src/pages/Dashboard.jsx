import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Name: {user.full_name}</p>
      <p>Role: {user.role}</p>

      {user.role === "admin" && <h3>Admin Panel</h3>}
      {user.role === "teacher" && <h3>Teacher Panel</h3>}
      {user.role === "student" && <h3>Student Panel</h3>}
      {user.role === "public" && <h3>Public Area</h3>}
    </div>
  );
}
