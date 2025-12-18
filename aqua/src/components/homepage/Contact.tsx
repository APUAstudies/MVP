export const Contact = () => (
  <section className="py-24 px-6 max-w-4xl mx-auto">
    <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-3xl p-12 text-center">
      <h2 className="text-3xl font-bold mb-4">Have a suggestion?</h2>
      <p className="text-[var(--text-muted)] mb-8">We're constantly adding new tools. Let us know what you need.</p>
      
      <form className="flex flex-col md:flex-row gap-4">
        <input 
          type="email" 
          placeholder="your@email.com" 
          className="flex-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md px-4 py-3 outline-none focus:border-[var(--primary)]"
        />
        <button className="bg-[var(--primary)] text-black font-bold px-8 py-3 rounded-md hover:opacity-90 transition-all">
          Join the waitlist
        </button>
      </form>
      
      <p className="mt-6 text-[11px] text-[var(--text-muted)] uppercase tracking-widest">
        Or email us at support@apua-studies.com
      </p>
    </div>
  </section>
);