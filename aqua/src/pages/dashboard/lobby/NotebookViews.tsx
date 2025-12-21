import { useOutletContext } from "react-router-dom";
import { ModularDashboard } from "./ModularDashboard";

export const NotebookHome = () => {
  const { currentPage, handleSavePage } = useOutletContext<any>();
  return <ModularDashboard pageData={currentPage} onSave={handleSavePage} />;
};

export const NotebookPage = () => {
  const { currentPage, handleSavePage } = useOutletContext<any>();
  return <ModularDashboard pageData={currentPage} onSave={handleSavePage} />;
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