import { useState } from "react";

export const AppearanceSettings = () => {
  const [theme, setTheme] = useState("dark");

  return (
    <section className="p-6 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl">
      <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Appearance</h2>
      <div className="grid grid-cols-3 gap-4">
        {['Light', 'Dark', 'System'].map((t) => (
          <button 
            key={t}
            onClick={() => setTheme(t.toLowerCase())}
            className={`p-4 border rounded-lg text-sm font-medium transition-all ${
              theme === t.toLowerCase() 
                ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' 
                : 'border-[var(--border-color)] hover:border-white/20'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
};