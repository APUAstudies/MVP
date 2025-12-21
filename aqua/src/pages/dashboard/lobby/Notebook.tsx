import { useLocation, useOutletContext, Outlet } from "react-router-dom";

export default function StudyNotebook() {
  const location = useLocation();
  const context = useOutletContext<any>();
  const { currentPage } = context;
  const isCustomPage = location.pathname.includes("/notebook/p/");

  return (
    <div className="h-full w-full flex flex-col bg-[#0a0a0a]">
      {isCustomPage && (
        <div className="px-8 pt-8 pb-4 max-w-7xl mx-auto w-full">
          <h1 className="text-4xl font-bold text-white/90 outline-none tracking-tight">
            {currentPage?.title || "Untitled Page"}
          </h1>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Outlet context={context} />
      </div>
    </div>
  );
}