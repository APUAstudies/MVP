import { Hero } from "../components/homepage/Hero";
import { About } from "../components/homepage/About";
import { Reviews } from "../components/homepage/Reviews";
import { Blogs } from "../components/homepage/Blogs";
import { Contact } from "../components/homepage/Contact";
import { TopNav } from "../components/layout/TopNav";

export default function Home() {
  return (
    <div className="bg-[var(--bg-main)] min-h-screen selection:bg-[var(--primary)] selection:text-black">
      <TopNav />

      <Hero />

      <div id="features">
        <About />
      </div>

      <div id="reviews">
        <Reviews />
      </div>

      <div id="blog">
        <Blogs />
      </div>

      <Contact />
      
      <footer className="py-12 border-t border-[var(--border-color)] text-center">
        <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">
          © 2025 APUA Studies. Built by students for life learners.
        </p>
      </footer>
    </div>
  );
}