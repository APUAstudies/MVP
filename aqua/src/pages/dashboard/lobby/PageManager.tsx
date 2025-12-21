import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ModularDashboard } from "./ModularDashboard";

const INITIAL_PAGE_CONTENT = [
  { id: "row-1", columns: [{ id: "c1", width: 100, blocks: [{ id: "b1", type: "text" }] }] }
];

export const PageManager = () => {
  const { pagename } = useParams();
  const navigate = useNavigate();
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
    const updatedPages = pages.map((p: any) => 
      p.id === id ? { ...p, content: newContent } : p
    );
    setPages(updatedPages);
    localStorage.setItem("user_pages", JSON.stringify(updatedPages));
  };

  const createNewPage = () => {
    const newName = prompt("Enter page title:");
    if (!newName) return;

    const newPage = {
      id: `page-${Date.now()}`,
      title: newName,
      content: INITIAL_PAGE_CONTENT
    };

    const updatedPages = [...pages, newPage];
    setPages(updatedPages);
    localStorage.setItem("user_pages", JSON.stringify(updatedPages));
    navigate(`/pages/${newName.toLowerCase()}`);
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