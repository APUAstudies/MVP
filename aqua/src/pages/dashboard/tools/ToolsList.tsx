import { ToolCard } from "../../../components/dashboard/ToolCard";
import { chromeExtensions, usefulWebsites } from "../../../ToolsConfig";
import type { ToolItem } from "../../../ToolsConfig";

interface ToolsListProps {
  type: 'extensions' | 'websites' | 'custom' | 'favorites' | 'suggest';
  title: string;
}

export const ToolsList = ({ type, title }: ToolsListProps) => {
  let displayTools: ToolItem[] = [];
  
  switch (type) {
    case 'extensions':
      displayTools = chromeExtensions || [];
      break;
    case 'websites':
      displayTools = usefulWebsites || [];
      break;
    case 'favorites':
      displayTools = [...chromeExtensions, ...usefulWebsites].filter(t => t.isPopular);
      break;
    case 'custom':
      displayTools = [];
      break;
    case 'suggest':
      displayTools = [];
      break;
    default:
      displayTools = [];
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-main)]">{title}</h2>
        {displayTools.length > 0 && (
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {displayTools.length} resources available
          </p>
        )}
      </div>

      {displayTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-white/5">
           <div className="bg-[var(--primary)]/10 p-4 rounded-full mb-4">
              <span className="text-4xl">🛠️</span>
           </div>
           <h3 className="text-[var(--text-main)] font-semibold text-lg">Coming Soon...</h3>
           <p className="text-[var(--text-muted)] text-sm max-w-[250px] text-center mt-2">
             We're still working on this feature. Check back in a few days!
           </p>
        </div>
      )}
    </div>
  );
};