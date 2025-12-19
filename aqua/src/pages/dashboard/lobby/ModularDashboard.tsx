import { 
  CalloutWidget, TextBoxWidget, TodoWidget, ToggleWidget, 
  VideoWidget, ImageWidget, EmbedWidget, TimerWidget 
} from "./Widgets";
import { useState, useMemo } from "react";
import { 
  DndContext, 
  closestCorners,
  KeyboardSensor, 
  PointerSensor, 
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WidgetWrapper } from './Lobby';

interface LobbyBlock {
  id: string;
  type: string;
  width: string;
}

export const ModularDashboard = () => {
  const [blocks, setBlocks] = useState<LobbyBlock[]>([
    { id: "1", type: "text", width: "col-span-12" },
    { id: "2", type: "timer", width: "col-span-4" },
    { id: "3", type: "todo", width: "col-span-8" }
  ]);

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [menuType, setMenuType] = useState<'slash' | null>(null);

  const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addBlockBelow = (id: string) => {
    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === id);
      const newBlock: LobbyBlock = { 
        id: `block-${Date.now()}`, 
        type: 'text', 
        width: 'col-span-12' 
      };
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock); 
      return newBlocks;
    });
  };

  const addBlock = (type: string) => {
    if (activeBlockId) {
      setBlocks(prev => prev.map(block => 
        block.id === activeBlockId ? { ...block, type } : block
      ));
    } else {
      const newBlock: LobbyBlock = {
        id: `block-${Date.now()}`,
        type,
        width: 'col-span-12'
      };
      setBlocks(prev => [...prev, newBlock]);
    }
    setMenuType(null);
    setActiveBlockId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === '/') setMenuType('slash');
    if (e.key === 'Escape') setMenuType(null);
  };

  const renderBlock = (block: LobbyBlock) => {
    const props = { onFocus: () => setActiveBlockId(block.id) };
    switch (block.type) {
      case "timer": return <TimerWidget {...props} />;
      case "todo": return <TodoWidget {...props} />;
      case "video": return <VideoWidget {...props} />;
      case "callout": return <CalloutWidget {...props} />;
      case "toggle": return <ToggleWidget {...props} />;
      case "image": return <ImageWidget {...props} />;
      case "embed": return <EmbedWidget {...props} />;
      default: return <TextBoxWidget {...props} />;
    }
  };

  return (
    <div onKeyDown={handleKeyDown} className="min-h-screen w-full bg-[#0a0a0a] text-white p-8 overflow-y-auto">
      {menuType === 'slash' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-[#1a1a1a] border border-[#333] rounded-xl z-[1000] p-2 shadow-2xl">
          {['text', 'todo', 'timer', 'video', 'callout', 'toggle'].map(type => (
            <button key={type} onClick={() => addBlock(type)} className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg capitalize text-sm">
              {type}
            </button>
          ))}
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <SortableContext items={blockIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto">
            {blocks.map(block => (
               <SortableItem 
                key={block.id} 
                id={block.id} 
                block={block} 
                renderBlock={() => renderBlock(block)} 
                onDelete={() => setBlocks(prev => prev.filter(b => b.id !== block.id))}
                onAddBelow={() => addBlockBelow(block.id)}
                />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export const SortableItem = ({ id, block, renderBlock, onDelete, onAddBelow }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={block.width}>
      <WidgetWrapper onDelete={onDelete} onAddBelow={onAddBelow} dragHandleProps={{ ...attributes, ...listeners }}>
        {renderBlock()}
      </WidgetWrapper>
    </div>
  );
};