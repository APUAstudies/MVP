import { useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const [notionConnected, setNotionConnected] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 mt-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        <div className="md:col-span-3 space-y-8">
          
          {/* profile */}
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

          {/* theme */}
          <section className="p-6 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Appearance</h2>
            <div className="grid grid-cols-3 gap-4">
              {['Light', 'Dark', 'System'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setTheme(t.toLowerCase())}
                  className={`p-4 border rounded-lg text-sm font-medium transition-all ${theme === t.toLowerCase() ? 'border-[var(--primary)] bg-[var(--primary)]/5 text-[var(--primary)]' : 'border-[var(--border-color)] hover:border-white/20'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* notion */}
          <section className="p-6 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <span className="p-1 bg-white rounded text-black text-[10px]">N</span> Notion Connection
                </h2>
                <p className="text-[12px] text-[var(--text-muted)] mt-1">Sync your Cornell notes directly to your Notion workspace.</p>
              </div>
              <button 
                onClick={() => setNotionConnected(!notionConnected)}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${notionConnected ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-white text-black'}`}
              >
                {notionConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </section>

          {/* pwd and 2fa */}
          <section className="p-6 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">Security</h2>
            <div className="flex justify-between items-center py-3 border-b border-[var(--border-color)]">
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-[11px] text-[var(--text-muted)]">Last changed 3 months ago</p>
              </div>
              <button className="text-xs text-[var(--primary)] font-bold hover:underline">Change password</button>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="text-sm font-medium">Two-factor Authentication</p>
                <p className="text-[11px] text-[var(--text-muted)]">Add an extra layer of security to your account.</p>
              </div>
              <div className="w-8 h-4 bg-white/10 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-2 h-2 bg-[var(--text-muted)] rounded-full"></div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}