import { chromeExtensions, usefulWebsites } from "../../configs/ToolsConfig";
import { ToolCard } from "./ToolCard";

export const ToolsOverview = () => {
  const popular = [...chromeExtensions, ...usefulWebsites].filter(t => t.isPopular);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-bold mb-6">Popular Picks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popular.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </section>
      
      <section className="p-8 border-2 border-dashed border-[var(--border-color)] rounded-2xl text-center">
        <p className="text-[var(--text-muted)] italic">Tools you "Heart" will appear here for quick access.</p>
      </section>
    </div>
  );
};