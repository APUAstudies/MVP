import { FileText, Plus, BookOpen, HelpCircle } from "lucide-react";
import { useOutletContext, Link } from "react-router-dom";
import { ModularDashboard } from "./ModularDashboard";

export const NotebookHome = () => {
  const { pages, handleCreatePage } = useOutletContext<any>();

  return (
    <div className="p-10 max-w-4xl mx-auto text-white">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to your Notebook</h1>
        <p className="text-white/50 text-lg">Organize your thoughts, tasks, and studies in one place.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all group">
          <BookOpen className="text-blue-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">How it works</h3>
          <p className="text-white/40 text-sm mb-4">Create pages for different subjects. Drag and drop widgets to customize your layout.</p>
          <Link to="/notebook/help" className="text-blue-400 text-sm hover:underline">Read the guide →</Link>
        </div>

        <button onClick={handleCreatePage} className="p-6 bg-blue-600 hover:bg-blue-500 rounded-2xl flex flex-col items-center justify-center transition-all">
          <Plus size={32} className="mb-2" />
          <span className="font-bold">Create New Page</span>
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-white/30" /> Your Pages
        </h2>
        <div className="space-y-2">
          {pages.filter((p: any) => p.id !== 'default-lobby').map((page: any) => (
            <Link 
              key={page.id} 
              to={`/notebook/p/${page.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              {page.title}
            </Link>
          ))}
          {pages.length <= 1 && <p className="text-white/20 italic">No pages created yet.</p>}
        </div>
      </div>
    </div>
  );
};

export const NotebookHelp = () => {
  const { handleResetMainPage } = useOutletContext<any>();

  return (
    <div className="p-10 max-w-3xl mx-auto text-white prose prose-invert">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-blue-400">
        Help & Guide
      </h1>
      
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-white">Troubleshooting</h2>
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
          <h3 className="text-red-400 font-bold mb-2">Reset Main Page</h3>
          <p className="text-white/60 text-sm mb-4">
            If you've made a mess of your main Notebook landing page, you can reset it to the original tutorial state here.
          </p>
          <button 
            onClick={handleResetMainPage}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-lg transition-colors"
          >
            Reset to Original State
          </button>
        </div>
      </section>
      <section>
        <h2 className="text-white text-xl font-semibold">1. Creating Blocks</h2>
        <p>Type <code className="bg-white/10 px-1 rounded">/</code> at the start of any text block to open the widget menu. You can choose from Text, To-dos, Timers, and more.</p>
      </section>
      <section>
        <h2 className="text-white text-xl font-semibold">2. Drag & Drop</h2>
        <p>Use the six-dot grip handle on the left of any block to move it up or down. You can also drop blocks onto "Row Zones" to create new sections.</p>
      </section>
      <section>
        <h2 className="text-white text-xl font-semibold">3. Columns</h2>
        <p>Click the grip handle and select "Split into Columns" to divide your workspace horizontally.</p>
      </section>
    </div>
  );
}

export const NotebookPage = () => {
  const { currentPage, handleSavePage } = useOutletContext<any>();
  return <ModularDashboard pageData={currentPage} onSave={handleSavePage} />;
};