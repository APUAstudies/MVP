import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { navLinks } from "../../configs/navConfig";
import { TopNav } from "./TopNav";
import { FileText, Plus } from "lucide-react";

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPagesExpanded, setIsPagesExpanded] = useState(true);
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem("user_pages");
    return saved ? JSON.parse(saved) : [
      { 
        id: "default-lobby", 
        title: "Lobby", 
        content: [{ id: "row-1", columns: [{ id: "c1", width: 100, blocks: [{ id: "b1", type: "text" }] }] }] 
      }
    ];
  });

  const activeMainItem = navLinks.find((link) => 
    location.pathname.startsWith(link.href)
  ) || navLinks[0];

  const handleCreatePage = () => {
    const title = prompt("Enter page name:");
    if (!title) return;
    
    const newPage = {
      id: `page-${Date.now()}`,
      title: title,
      content: [{ id: "row-1", columns: [{ id: "c1", width: 100, blocks: [{ id: "b1", type: "text" }] }] }]
    };

    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    localStorage.setItem("user_pages", JSON.stringify(updatedPages));
    navigate(`/notebook/p/${title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleSavePage = (id: string, newContent: any) => {
    const updatedPages = pages.map((p: any) => 
      p.id === id ? { ...p, content: newContent } : p
    );
    setPages(updatedPages);
    localStorage.setItem("user_pages", JSON.stringify(updatedPages));
  };

  const currentPage = pages.find((p: any) => 
    location.pathname.includes(p.title.toLowerCase().replace(/\s+/g, '-'))
  ) || pages[0];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
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
                className={`p-2 rounded-lg transition-all ${isActive ? "text-[var(--primary)] bg-[var(--primary)]/10" : "text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-white/5"}`}
              >
                <span className="text-xl">{link.icon}</span>
              </Link>
            );
          })}
          <Link to="/settings" className="mt-auto p-2 text-[var(--text-muted)] hover:text-[var(--primary)]">⚙️</Link>
        </aside>

        {/* sub pages */}
        <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-sidebar-text)] hidden md:flex flex-col">
          <div className="p-4 border-b border-[var(--border-color)] flex flex-col gap-1">
            <h2 className="font-semibold text-sm text-[var(--text-main)]">
              {activeMainItem.label}
            </h2>
            <p className="text-[11px] leading-normal text-[var(--text-muted)] mt-2">
              {activeMainItem.description}
            </p>
          </div>

          <div className="p-2 flex flex-col gap-1 overflow-y-auto font-sans">
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
                  {/* nested under notebook */}
                  {activeMainItem.label === "Notebook" && sub.label === "Notebook" && (
                    <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-white/10">
                      <div 
                        className="px-3 py-1 flex justify-between items-center group cursor-pointer hover:bg-white/5 rounded-r-md transition-colors"
                        onClick={() => setIsPagesExpanded(!isPagesExpanded)}
                      >
                        <p className="text-[11px] font-medium text-[var(--text-muted)] flex items-center gap-2">
                          <span className={`text-[8px] transition-transform duration-200 ${isPagesExpanded ? 'rotate-0' : '-rotate-90'}`}>
                             ▼
                          </span>
                          Pages
                        </p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCreatePage(); }} 
                          className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity p-0.5"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      
                      {/* pages */}
                      {isPagesExpanded && (
                        <div className="flex flex-col gap-0.5 ml-2 mb-2">
                          {pages.map((page: any) => {
                            const pageHref = `/notebook/p/${page.title.toLowerCase().replace(/\s+/g, '-')}`;
                            const isPageActive = location.pathname === pageHref;

                            return (
                              <Link 
                                key={page.id}
                                to={pageHref}
                                className={`px-3 py-1 text-[12px] rounded-md flex items-center gap-2 transition-all ${
                                  isPageActive 
                                  ? "text-[var(--primary)] font-medium bg-[var(--primary)]/5" 
                                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5"
                                }`}
                              >
                                <FileText size={12} className="opacity-50" />
                                <span className="truncate">{page.title}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* main area */}
        <main className="flex-1 overflow-y-auto bg-[#121212]">
          <Outlet context={{ pages, handleCreatePage, currentPage, handleSavePage }} />
        </main>
      </div>
    </div>
  );
};