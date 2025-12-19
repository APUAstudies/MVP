import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { GripVertical, Plus, Settings2, Columns } from "lucide-react";
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
  children, onDelete, onAddBelow, onAddColumn, onResize, dragHandleProps, showResizer 
}: any) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onResize) return;
    e.preventDefault();
    e.stopPropagation(); 
    const onMouseMove = (moveEvent: MouseEvent) => onResize(moveEvent.movementX);
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "default";
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
  };

  return (
    <div className="group relative flex gap-1 w-full items-start transition-all duration-200">
      {showResizer && (
        <div onMouseDown={handleMouseDown} className="absolute -left-[14px] top-0 bottom-0 w-6 cursor-col-resize z-50 group/resizer flex justify-center">
          <div className="h-full w-[1.5px] bg-white/[0.05] group-hover/resizer:bg-blue-500/40 active:bg-blue-500 transition-colors duration-200" />
        </div>
      )}

      <div className="flex items-center mt-1 shrink-0">
        <button onClick={onAddBelow} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-opacity">
          <Plus size={16} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-opacity">
            <Settings2 size={16} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setShowMenu(false)} />
              <div className="absolute left-full ml-2 top-0 w-40 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-[70] py-1">
                <button onClick={() => { onAddColumn(); setShowMenu(false); }} 
                  className="w-full text-left px-3 py-2 text-xs hover:bg-white/5 flex items-center gap-2">
                  <Columns size={14} /> Split into Columns
                </button>
                <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-red-500/20 text-red-400 flex items-center gap-2">
                   Delete
                </button>
              </div>
            </>
          )}
        </div>

        <button {...dragHandleProps} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical size={18} />
        </button>
      </div>

      <div className="flex-1 bg-white/[0.02] border border-transparent group-hover:border-white/10 rounded-xl p-4 min-h-[40px] transition-all">
        {children}
      </div>
    </div>
  );
};