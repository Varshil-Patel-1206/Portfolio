import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Services from "../components/Services";
import ExperienceEducation from "../components/ExperienceEducation";
import Gallery from "../components/Gallery";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Certifications from "../components/Certifications";

function Home() {
  return (
    <div className="site-shell bg-white text-black">
      <Navbar />

      <main>
        <Hero />

        <About />

        <Skills />

        <Projects />

        <Services />

        <ExperienceEducation />

        <Certifications />
        
        <Gallery />

        <Contact />

        <Footer />
      </main>
    </div>
  );
}

export default Home;