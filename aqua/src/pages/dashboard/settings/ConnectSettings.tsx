import { useState } from "react";

export const ConnectSettings = () => {
  const [notionConnected, setNotionConnected] = useState(false);

  return (
    <section className="p-6 bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-sm font-bold flex items-center gap-2 text-[var(--text-main)]">
            <span className="p-1 bg-white rounded text-black text-[10px] font-black">N</span> 
            Notion Connection
          </h2>
          <p className="text-[12px] text-[var(--text-muted)] mt-2 leading-relaxed">
            Sync your Cornell notes and study schedules directly to your Notion workspace.
          </p>
        </div>
        <button 
          onClick={() => setNotionConnected(!notionConnected)}
          className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
            notionConnected 
              ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' 
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {notionConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </section>
  );
};