import { Container } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="w-100 py-4 text-center text-secondary border-top border-secondary border-opacity-25" style={{ background: "#0b0e14" }}>
      <Container>
        © {new Date().getFullYear()} SchoolBeat | All Rights Reserved
      </Container>
    </footer>
  );
}