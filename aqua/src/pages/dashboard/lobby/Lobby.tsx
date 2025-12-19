import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { GripVertical, Plus, Trash2, Settings2 } from "lucide-react";
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

interface WidgetWrapperProps {
  children: React.ReactNode;
  onDelete: () => void;
  onAddBelow: () => void;
  dragHandleProps?: any;
}

export const WidgetWrapper = ({ children, onDelete, onAddBelow, dragHandleProps }: WidgetWrapperProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative flex gap-2 w-full items-start transition-all duration-200">
      <div className="flex items-center pt-1">
        {/* + button */}
        <button 
          onClick={onAddBelow}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-opacity"
        >
          <Plus size={16} />
        </button>

        {/* grip handle */}
        <div className="relative">
          <button 
            {...dragHandleProps} 
            style={{ touchAction: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={18} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-[60]" onClick={() => setShowMenu(false)} />
              <div className="absolute left-full ml-2 top-0 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl z-[70] py-1.5 animate-in fade-in zoom-in duration-150">
                <button onClick={() => { onAddBelow(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-[12px] hover:bg-white/5 text-white">
                  <Plus size={14} /> Add Block Below
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[12px] hover:bg-white/5 text-white">
                  <Settings2 size={14} /> Widget Settings
                </button>
                <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-[12px] hover:bg-rose-500/20 text-rose-500 border-t border-white/5">
                  <Trash2 size={14} /> Remove Block
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* content */}
      <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
        {children}
      </div>
    </div>
  );
};