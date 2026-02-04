
import { Container, Row, Col, Button } from "react-bootstrap";

export default function Hero() {

  const scrollToCompetitions = () => {
    const section = document.getElementById("competitions");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "100px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
      }}
    >
      {/* Background Gradients */}
      <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50%", height: "50%", background: "rgba(99, 102, 241, 0.2)", filter: "blur(120px)", borderRadius: "50%", zIndex: -1 }}></div>
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "50%", background: "rgba(236, 72, 153, 0.2)", filter: "blur(120px)", borderRadius: "50%", zIndex: -1 }}></div>

      <Container>
        <Row className="align-items-center gy-5">
          <Col md={6} className="text-center text-md-start">
            <h1 style={{ fontSize: "3.5rem", fontWeight: "800", lineHeight: "1.2", marginBottom: "1.5rem" }}>
              Unleash Your <br />
              <span className="text-gradient">Musical Talent</span> 🎤
            </h1>
            <p className="lead text-secondary mb-4" style={{ fontSize: "1.2rem" }}>
              Join SchoolBeat competitions and win scholarships, recording contracts,
              and masterclasses. showing the world what you've got.
            </p>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start">
              <Button
                onClick={scrollToCompetitions}
                style={{ background: "linear-gradient(to right, #6366f1, #ec4899)", border: "none", padding: "12px 30px", fontWeight: "600" }}
                className="rounded-pill shadow-lg"
              >
                Explore Competitions <i className="bi bi-arrow-right ms-2"></i>
              </Button>
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4"
                style={{ padding: "12px 30px", fontWeight: "600" }}
              >
                Learn More
              </Button>
            </div>
          </Col>

          <Col md={6}>
            <div className="position-relative">
              <div
                className="rounded-4 overflow-hidden shadow-lg border border-secondary border-opacity-25"
                style={{ transform: "rotate(3deg)", transition: "transform 0.3s ease" }}
              >
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(11,14,20,0.8), transparent)", zIndex: 10 }}></div>
                <img
                  src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80"
                  alt="Music Performance"
                  className="img-fluid w-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
