export const ProfileSettings = () => {
  return (
    <section className="p-6 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl">
      <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-6">Profile</h2>
      
      <div className="flex items-center gap-6 mb-8">
        <div className="relative group cursor-pointer">
          <img 
            src="https://ui-avatars.com/api/?name=User&background=3ecf8e&color=fff" 
            alt="Profile" 
            className="w-20 h-20 rounded-full border-2 border-[var(--border-color)] group-hover:opacity-70 transition-opacity" 
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-bold">CHANGE</div>
        </div>
        <div>
          <button className="px-3 py-1.5 text-xs border border-[var(--border-color)] rounded-md hover:bg-white/5">Upload new picture</button>
          <p className="text-[11px] text-[var(--text-muted)] mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Display Name</label>
          <input type="text" defaultValue="Alex Rivera" className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2 text-sm outline-none focus:border-[var(--primary)]" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium">Email Address</label>
          <input type="email" defaultValue="alex@example.com" className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2 text-sm outline-none focus:border-[var(--primary)]" />
        </div>
      </div>
    </section>
  );
};