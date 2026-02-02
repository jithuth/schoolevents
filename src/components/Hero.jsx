import "../styles/Hero.css";

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
    <section className="hero">
      <div className="hero-left">
        <h1>Unleash Your Musical Talent 🎤</h1>

        <p>
          Join SchoolBeat competitions and win scholarships, recording contracts,
          and masterclasses.
        </p>

        {/* 👇 ONLY CHANGE IS HERE */}
        <button onClick={scrollToCompetitions}>
          Explore Competitions
        </button>
      </div>

      <div className="hero-right">
        <img
          src="https://images.unsplash.com/photo-1511379938547-c1f69419868d"
          alt="music"
        />
      </div>
    </section>
  );
}
