import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { navLinks } from "../../configs/navConfig";
import { INITIAL_NOTEBOOK_CONTENT, NOTEBOOK_MAIN_ID } from "../../configs/noteConfig";
import { TopNav } from "./TopNav";
import { FileText, Plus, ChevronDown } from "lucide-react";

export const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPagesExpanded, setIsPagesExpanded] = useState(true);
  
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem("user_pages");
    return saved ? JSON.parse(saved) : [
      { 
        id: NOTEBOOK_MAIN_ID, 
        title: "Lobby", 
        content: INITIAL_NOTEBOOK_CONTENT 
      }
    ];
  });

  const activeMainItem = navLinks.find((link) => 
    location.pathname.startsWith(link.href)
  ) || navLinks[0];

  const currentPage = pages.find((p: any) => {
    const isLobby = p.id === NOTEBOOK_MAIN_ID;
    const lobbyPath = "/notebook";
    const customPath = `/notebook/p/${p.title.toLowerCase().replace(/\s+/g, '-')}`;
    return isLobby ? location.pathname === lobbyPath : location.pathname === customPath; 
  }) || pages.find(p => p.id === NOTEBOOK_MAIN_ID);

  const handleCreatePage = () => {
    const title = prompt("Enter page name:");
    if (!title) return;
    
    const newPage = {
      id: `page-${Date.now()}`,
      title: title,
      content: [{ id: "row-1", columns: [{ id: "c1", width: 100, blocks: [{ id: "b1", type: "text", data: { text: "" } }] }] }]
    };

    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    localStorage.setItem("user_pages", JSON.stringify(updatedPages));
    navigate(`/notebook/p/${title.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleSavePage = (id: string, newContent: any) => {
    setPages((prev: any) => {
      const updated = prev.map((p: any) => p.id === id ? { ...p, content: newContent } : p);
      localStorage.setItem("user_pages", JSON.stringify(updated));
      return updated;
    });
  };

  const handleResetMainPage = () => {
    if (window.confirm("Are you sure? This will reset the Lobby to the original template.")) {
      setPages((prevPages: any[]) => {
        const newPages = prevPages.map((p) => {
          if (p.id === NOTEBOOK_MAIN_ID) {
            return { ...p, content: JSON.parse(JSON.stringify(INITIAL_NOTEBOOK_CONTENT)) };
          }
          return p;
        });
        localStorage.setItem("user_pages", JSON.stringify(newPages));
        return newPages;
      });
      alert("Lobby has been reset!");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
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

        {/* sub sidebar */}
        <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--bg-sidebar-text)] hidden md:flex flex-col">
          <div className="p-4 border-b border-[var(--border-color)]">
            <h2 className="font-semibold text-sm text-[var(--text-main)]">{activeMainItem.label}</h2>
            <p className="text-[11px] text-[var(--text-muted)] mt-2">{activeMainItem.description}</p>
          </div>

          <div className="p-2 flex flex-col gap-1 overflow-y-auto">
            {activeMainItem.subItems.map((sub, index) => {
              const showHeader = index === 0 || (sub.category && sub.category !== activeMainItem.subItems[index - 1].category);
              
              return (
                <div key={sub.label + index} className="group">
                  {showHeader && sub.category && (
                    <p className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      {sub.category}
                    </p>
                  )}

                  {sub.label === "Notebook" ? (
                    <div className="flex flex-col">
                      <div 
                        className={`px-3 py-1.5 text-[13px] rounded-md flex justify-between items-center cursor-pointer transition-all ${
                          location.pathname.startsWith("/notebook") 
                          ? "bg-white/5 text-[var(--text-main)] font-medium" 
                          : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5"
                        }`}
                        onClick={() => {
                          setIsPagesExpanded(!isPagesExpanded);
                          if (location.pathname !== "/notebook") navigate("/notebook");
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isPagesExpanded ? "" : "-rotate-90"}`} />
                          {sub.label}
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleCreatePage(); }} 
                          className="opacity-0 group-hover:opacity-100 hover:text-[var(--primary)] transition-opacity p-0.5"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {isPagesExpanded && (
                        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-white/10">
                          {pages.map((page: any) => {
                            const isLobbyItem = page.id === NOTEBOOK_MAIN_ID;
                            const pageHref = isLobbyItem ? "/notebook" : `/notebook/p/${page.title.toLowerCase().replace(/\s+/g, '-')}`;
                            const isPageActive = location.pathname === pageHref;

                            return (
                              <Link 
                                key={page.id}
                                to={pageHref}
                                className={`px-3 py-1 text-[12px] rounded-r-md flex items-center gap-2 transition-all border-l-2 ${
                                  isPageActive 
                                  ? "text-[var(--primary)] font-medium bg-[var(--primary)]/5 border-[var(--primary)]" 
                                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 border-transparent"
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
                  ) : (
                    <Link 
                      to={sub.href} 
                      className={`px-3 py-1.5 text-[13px] rounded-md flex items-center transition-all ${
                        location.pathname === sub.href 
                        ? "bg-white/5 text-[var(--text-main)] font-medium border-l-2 border-[var(--primary)] rounded-l-none" 
                        : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#121212]">
          <Outlet context={{ pages, handleCreatePage, currentPage, handleSavePage, handleResetMainPage }} />
        </main>
      </div>
    </div>
  );
};