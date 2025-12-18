import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden border-b border-[var(--border-color)]">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 z-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="h-full w-full bg-[size:40px_40px] bg-[linear-gradient(to_right,#2e2e2e_1px,transparent_1px),linear-gradient(to_bottom,#2e2e2e_1px,transparent_1px)]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
          </span>
          Now syncing with Notion API
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
          Master your focus. <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-emerald-200">
            Automate your study.
          </span>
        </h1>

        <p className="text-[var(--text-muted)] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one productivity suite for technical students. Cornell notes, 
          deep-work timers, and accountability groups in one unified interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/lobby" 
            className="w-full sm:w-auto px-8 py-4 bg-[var(--primary)] text-black font-bold rounded-lg text-lg hover:shadow-[0_0_30px_rgba(62,207,142,0.4)] transition-all active:scale-95"
          >
            Start Studying Free
          </Link>
          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-4 border border-[var(--border-color)] text-[var(--text-main)] font-bold rounded-lg text-lg hover:bg-white/5 transition-all"
          >
            Sign In
          </Link>
        </div>

        {/* Dashboard Preview Decoration */}
        <div className="mt-20 relative rounded-2xl border border-[var(--border-color)] bg-[var(--bg-sidebar)] p-2 shadow-2xl">
           <div className="rounded-xl border border-[var(--border-color)] overflow-hidden bg-[var(--bg-main)] aspect-video flex items-center justify-center">
              <span className="text-[var(--text-muted)] font-mono">Interactive Dashboard Demo Preview</span>
           </div>
        </div>
      </div>
    </section>
  );
};