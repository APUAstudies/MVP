export const NoteEditor = () => {
  return (
    <div className="flex flex-col h-full border border-[var(--border-color)] bg-[var(--bg-sidebar)] rounded-xl overflow-hidden">
      {/* header */}
      <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-main)]">
        <input 
          placeholder="Topic: Chemical Bonding" 
          className="bg-transparent text-xl font-bold outline-none w-full placeholder:opacity-30"
        />
      </div>

      <div className="flex flex-1 min-h-[400px]">
        {/* questions */}
        <div className="w-1/3 border-r border-[var(--border-color)] p-4">
          <label className="text-[10px] font-bold uppercase text-[var(--primary)] mb-2 block tracking-widest">Questions / Cues</label>
          <textarea className="w-full h-full bg-transparent outline-none resize-none text-sm leading-relaxed" placeholder="Key points to recall..." />
        </div>

        {/* notes */}
        <div className="w-2/3 p-4">
          <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2 block tracking-widest">Notes</label>
          <textarea className="w-full h-full bg-transparent outline-none resize-none text-sm leading-relaxed" placeholder="Detailed notes go here during the lecture..." />
        </div>
      </div>

      {/* summary */}
      <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)]">
        <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2 block tracking-widest">Summary</label>
        <textarea className="w-full h-24 bg-transparent outline-none resize-none text-sm" placeholder="Summarize the entire session in 2-3 sentences..." />
      </div>
    </div>
  );
};