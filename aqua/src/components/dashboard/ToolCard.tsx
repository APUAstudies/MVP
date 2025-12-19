import type { ToolItem } from "../../configs/ToolsConfig";

export const ToolCard = ({ tool }: { tool: ToolItem }) => (
  <div className="bg-[var(--bg-sidebar)] border border-[var(--border-color)] rounded-xl p-5 hover:border-[var(--primary)] transition-all flex flex-col gap-3 group">
    <div className="flex justify-between items-start">
      <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest bg-[var(--primary)]/10 px-2 py-0.5 rounded">
        {tool.category}
      </span>
      <button className="text-[var(--text-muted)] hover:text-rose-500 transition-colors">❤</button>
    </div>
    <h3 className="font-bold text-[var(--text-main)] group-hover:text-[var(--primary)]">{tool.title}</h3>
    <p className="text-xs text-[var(--text-muted)] leading-relaxed flex-1">{tool.description}</p>
    <a href={tool.link} target="_blank" className="mt-2 text-xs font-bold text-[var(--text-main)] flex items-center gap-1 hover:underline">
      Open Link ↗
    </a>
  </div>
);