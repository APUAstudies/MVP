export const About = () => (
  <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    <div>
      <h2 className="text-[var(--primary)] font-mono text-sm tracking-widest uppercase mb-4">// Our Mission</h2>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
        Focus on what matters. <br /> We handle the rest.
      </h1>
      <p className="text-[var(--text-muted)] text-lg leading-relaxed mb-8">
        APUA Studies was built for students and professionals who are tired of jumping between five different apps to stay productive. We combined the best of Cornell Notes, Pomodoro methodology, and social accountability into one high-performance interface.
      </p>
      <div className="grid grid-cols-2 gap-6">
        <div className="border-l-2 border-[var(--primary)] pl-4">
          <h4 className="font-bold">Privacy First</h4>
          <p className="text-xs text-[var(--text-muted)]">Your data stays your own.</p>
        </div>
        <div className="border-l-2 border-[var(--primary)] pl-4">
          <h4 className="font-bold">Sync Everywhere</h4>
          <p className="text-xs text-[var(--text-muted)]">Notion, Google, and more.</p>
        </div>
      </div>
    </div>
    <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-2xl aspect-video flex items-center justify-center relative overflow-hidden">
       {/* Placeholder for a screenshot of the Dashboard */}
       <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/10 to-transparent" />
       <span className="text-[var(--text-muted)] font-mono text-sm">Dashboard Preview</span>
    </div>
  </section>
);