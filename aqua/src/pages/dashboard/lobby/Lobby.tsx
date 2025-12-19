import { useState, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { GripVertical, Plus, Columns, Trash2,
  Copy, ChevronRight, Paintbrush, RefreshCw } from "lucide-react";
import { ModularDashboard } from "./ModularDashboard";

export default function StudyLobby() {
  const location = useLocation();
  const isMainLobby = location.pathname.includes("/lobby");

  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0a]">
      {isMainLobby ? <ModularDashboard /> : <Outlet />}
    </div>
  );
}

export const WidgetWrapper = ({ 
  children, 
  onDelete, 
  onAddBelow, 
  onAddColumn, 
  onDuplicate,
  onConvert,
  onUpdateColor,
  onResize, 
  dragHandleProps, 
  showResizer,
  colorProps
}: any) => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<'turn' | 'color' | null>(null);

  const blockOptions = [
    { id: 'text', label: 'Text' },
    { id: 'todo', label: 'To-do list' },
    { id: 'toggle', label: 'Toggle list' },
    { id: 'callout', label: 'Callout' },
    { id: 'video', label: 'Video' },
  ];

  const colors = {
    text: [
      { label: 'Default', value: 'text-white' },
      { label: 'Gray', value: 'text-gray-400' },
      { label: 'Blue', value: 'text-blue-400' },
      { label: 'Red', value: 'text-red-400' },
    ],
    bg: [
      { label: 'Default', value: 'bg-transparent' },
      { label: 'Gray', value: 'bg-[#2b2b2b]' },
      { label: 'Blue', value: 'bg-[#1d283a]' },
      { label: 'Yellow', value: 'bg-[#3f3a1d]' },
    ]
  };

  return (
    <div className="group relative flex gap-0 w-full items-start transition-all duration-200">

      <div className="flex items-center shrink-0 min-h-[32px]">
        <button 
          onClick={onAddBelow} 
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded text-white/30 hover:text-white transition-all">
          <Plus size={16} />
        </button>

        <div className="relative">
          <button 
            {...dragHandleProps}
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/5 rounded text-white/30 hover:text-white transition-all">
            <GripVertical size={18} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => { setShowMenu(false); setActiveSubMenu(null); }}/>
              <div className="absolute left-full ml-2 top-0 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-[70] py-1">

                {/* turn into */}
                <div className="relative" onMouseEnter={() => setActiveSubMenu('turn')}>
                  <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center justify-between text-white/80">
                    <div className="flex items-center gap-2"><RefreshCw size={14} /> Turn into</div>
                    <ChevronRight size={12} />
                  </button>
                  {activeSubMenu === 'turn' && (
                    <div className="absolute left-full top-0 ml-1 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-1">
                      {blockOptions.map(opt => (
                        <button key={opt.id} onClick={() => { onConvert(opt.id); setShowMenu(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 text-white/70">
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* color */}
                <div className="relative" onMouseEnter={() => setActiveSubMenu('color')}>
                  <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center justify-between text-white/80">
                    <div className="flex items-center gap-2"><Paintbrush size={14} /> Color</div>
                    <ChevronRight size={12} />
                  </button>
                  {activeSubMenu === 'color' && (
                    <div className="absolute left-full top-0 ml-1 w-44 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl py-1 max-h-80 overflow-y-auto">
                      <div className="px-3 py-1 text-[10px] text-white/40 font-bold uppercase">Text</div>
                      {colors.text.map(c => (
                        <button key={c.label} onClick={() => { onUpdateColor(c.value, false); setShowMenu(false); }}
                          className={`w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 ${c.value}`}>
                          {c.label}
                        </button>
                      ))}
                      <div className="px-3 py-1 text-[10px] text-white/40 font-bold uppercase mt-2">Background</div>
                      {colors.bg.map(c => (
                        <button key={c.label} onClick={() => { onUpdateColor(c.value, true); setShowMenu(false); }}
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border border-white/10 ${c.value}`} />
                          <span className="text-white/70">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* duplicate */}
                <button onClick={() => { onDuplicate(); setShowMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2 text-white/80">
                  <Copy size={14} /> Duplicate
                </button>

                {/* columns */}
                <button onClick={() => { onAddColumn(); setShowMenu(false); }} 
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2 text-white/80">
                  <Columns size={14} /> Split into Columns
                </button>

                <div className="h-[1px] bg-white/5 my-1" />

                {/* delete */}
                <button onClick={() => { onDelete(); setShowMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 flex items-center gap-2 text-red-400">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-xl px-2 min-h-[30px] transition-all">
        {children}
      </div>
    </div>
  );
};
