import Hero from "./Hero";
import Competitions from "../pages/Competitions";

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <Hero />

      {/* EXPLORE COMPETITIONS SECTION */}
      <div id="competitions" style={{ padding: "40px 20px" }}>
        <Competitions />
      </div>
    </>
  );
}
