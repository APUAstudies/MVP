import { Link, Outlet, useLocation } from "react-router-dom";
import { navLinks } from "../../navConfig";
import { TopNav } from "./TopNav";

export const DashboardLayout = () => {
  const location = useLocation();

  const activeMainItem = navLinks.find((link) => 
    location.pathname.startsWith(link.href)
  ) || navLinks[0];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* top sidebar */}
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        
        {/* icon sidebar */}
        <aside className="w-14 border-r border-[var(--border-color)] bg-[var(--bg-sidebar-icon)] flex flex-col items-center py-4 gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.href);
            return (
              <Link 
                key={link.label} 
                to={link.href} 
                title={link.label} 
                className={`p-2 rounded-lg transition-all ${
                  isActive 
                  ? "text-[var(--primary)] bg-[var(--primary)]/10" 
                  : "text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-white/5"
                }`}
              >
                <span className="text-xl">{link.icon}</span>
              </Link>
            );
          })}
          <Link to="/settings" className="mt-auto p-2 text-[var(--text-muted)] hover:text-[var(--primary)]">⚙️</Link>
        </aside>

        {/* sub pages */}
        <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-sidebar-text)] hidden md:flex flex-col">
          {/* label & description */}
          <div className="p-4 border-b border-[var(--border-color)] flex flex-col gap-1">
            <h2 className="font-semibold text-sm text-[var(--text-main)]">
              {activeMainItem.label}
            </h2>
            <p className="text-[11px] leading-normal text-[var(--text-muted)] mt-2">
              {activeMainItem.description}
            </p>
          </div>

          {/* sub item list */}
          <div className="p-2 flex flex-col gap-1 overflow-y-auto">
            {activeMainItem.subItems.map((sub, index) => {
              const showHeader = index === 0 || (sub.category && sub.category !== activeMainItem.subItems[index - 1].category);
              const isSubActive = location.pathname === sub.href;

              return (
                <div key={sub.label + index}>
                  {showHeader && sub.category && (
                    <p className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      {sub.category}
                    </p>
                  )}
                  <Link 
                    to={sub.href} 
                    className={`px-3 py-1.5 text-[13px] rounded-md flex justify-between items-center transition-all ${
                      isSubActive 
                      ? "bg-white/5 text-[var(--text-main)] font-medium border-l-2 border-[var(--primary)] rounded-l-none" 
                      : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5"
                    }`}
                  >
                    {sub.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </aside>

        {/* main */}
        <main className="flex-1 overflow-y-auto bg-[#121212]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};