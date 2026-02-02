import { useEffect, useState } from "react";
import { getProfile } from "../api/authApi";

export default function Profile() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("access");

    getProfile(token)
      .then((res) => setProfile(res.data))
      .catch(() => alert("Unauthorized"));

  }, []);

  if (!profile) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Profile</h2>
      <p><b>Username:</b> {profile.username}</p>
      <p><b>Name:</b> {profile.full_name}</p>
      <p><b>Role:</b> {profile.role}</p>
      <p><b>Phone:</b> {profile.phone}</p>
    </div>
  );
}