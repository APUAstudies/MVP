import { useState } from "react";
import { useParams } from "react-router-dom";
import { ModularDashboard } from "./ModularDashboard";

const INITIAL_PAGE_CONTENT = [
  { id: "row-1", columns: [{ id: "c1", width: 100, blocks: [{ id: "b1", type: "text" }] }] }
];

export const PageManager = () => {
  const { pagename } = useParams();
  const [pages, setPages] = useState(() => {
    const saved = localStorage.getItem("user_pages");
    return saved ? JSON.parse(saved) : [
      { id: "default", title: "Lobby", content: INITIAL_PAGE_CONTENT }
    ];
  });

  const currentPage = pages.find(
    (p: any) => p.title.toLowerCase() === pagename?.toLowerCase()
  ) || pages[0];

  const handleSave = (id: string, newContent: any) => {
		setPages((prevPages: any) => {
			const updated = prevPages.map((p: any) => 
				p.id === id ? { ...p, content: newContent } : p
			);
			localStorage.setItem("user_pages", JSON.stringify(updated));
			return updated;
		});
	};

  

  return (
    <div className="flex h-full w-full">
      <ModularDashboard 
        pageData={currentPage} 
        onSave={handleSave} 
      />
    </div>
  );
};