import { useState } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../../configs/navConfig";
import logo from "../../assets/logo.png"

export const TopNav = () => {
  const [isProductOpen, setIsProductOpen] = useState(false);

  return (
    <nav className="h-14 border-b border-[var(--border-color)] bg-[var(--bg-sidebar-icon)] flex items-center px-4 justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-4 mr-4">
          <img src={logo} alt="APUA Logo" className="h-8 w-8 rounded-full object-cover" />
          <span className="font-bold text-lg tracking-tighter">APUA Studies</span>
        </Link>

        {/* links */}
        <div className="hidden lg:flex gap-6">
          <button 
            onMouseEnter={() => setIsProductOpen(true)}
            className="text-[13px] text-[var(--text-muted)] hover:text-white flex items-center gap-1"
          >
            Product <span className="text-[10px]">▼</span>
          </button>
          <Link to="/docs" className="text-[13px] text-[var(--text-muted)] hover:text-white">Docs</Link>
          <Link to="/pricing" className="text-[13px] text-[var(--text-muted)] hover:text-white">Pricing</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/login" className="text-[13px] text-[var(--text-muted)] hover:text-white font-medium">Sign in</Link>
        <Link to="/dashboard" className="text-[13px] bg-[var(--primary)] text-black font-bold px-3 py-1 rounded-md hover:opacity-90 transition-all">
          Dashboard
        </Link>
      </div>

      {isProductOpen && (
        <div 
          onMouseLeave={() => setIsProductOpen(false)}
          className="absolute top-14 left-40 w-[600px] bg-[#1c1c1c] border border-[var(--border-color)] rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-8 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col gap-4">
            <h4 className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">Database</h4>
            <div className="group cursor-pointer">
              <p className="text-sm font-bold group-hover:text-[var(--primary)]">Postgres Database</p>
              <p className="text-xs text-[var(--text-muted)]">Fully portable Postgres database.</p>
            </div>
          </div>
          <div className="bg-[#242424] p-4 rounded-lg border border-[var(--border-color)]">
            <p className="text-xs font-bold mb-2">CUSTOMER STORIES</p>
            <p className="text-sm italic text-[var(--text-muted)]">"Juniver built automated workflows with Supabase Edge Functions..."</p>
          </div>
        </div>
      )}
    </nav>
  );
};