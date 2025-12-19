import { useState, useRef } from "react";
import { 
  DndContext, 
  closestCorners, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WidgetWrapper } from './Lobby';
import { TextBoxWidget, TodoWidget, TimerWidget, VideoWidget, CalloutWidget } from "./Widgets";

interface LobbyBlock { id: string; type: string; }
interface LobbyColumn { id: string; width: number; blocks: LobbyBlock[]; }
interface LobbyRow { id: string; columns: LobbyColumn[]; }

export const ModularDashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<LobbyRow[]>([
    { id: "row-1", columns: [{ id: "c1", width: 100, blocks: [{ id: "b1", type: "text" }] }] }
  ]);

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [menuType, setMenuType] = useState<'slash' | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleManualReorder = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setRows(currentRows => {
      let movedBlock: LobbyBlock | null = null;
      const rowsAfterRemoval = currentRows.map(row => ({
        ...row,
        columns: row.columns.map(col => {
          const bIdx = col.blocks.findIndex(b => b.id === active.id);
          if (bIdx !== -1) {
            [movedBlock] = col.blocks.splice(bIdx, 1);
          }
          return { ...col, blocks: [...col.blocks] };
        }).filter(col => col.blocks.length > 0 || row.columns.length > 1) 
      })).filter(r => r.columns.some(c => c.blocks.length > 0)); 

      if (!movedBlock) return currentRows;
      if (over.id.toString().startsWith('dropzone-')) {
        const targetRowIndex = parseInt(over.id.toString().split('-')[1]);
        const newRow: LobbyRow = {
          id: `row-${Date.now()}`,
          columns: [{ id: `c-${Date.now()}`, width: 100, blocks: [movedBlock] }]
        };
        const updatedRows = [...rowsAfterRemoval];
        updatedRows.splice(targetRowIndex, 0, newRow);
        return updatedRows;
      }

      return rowsAfterRemoval.map(row => ({
        ...row,
        columns: row.columns.map(col => {
          const overIdx = col.blocks.findIndex(b => b.id === over.id);
          if (overIdx !== -1) {
            col.blocks.splice(overIdx, 0, movedBlock!);
          } else if (col.id === over.id) {
            col.blocks.push(movedBlock!);
          }
          return { ...col, blocks: [...col.blocks] };
        })
      }));
    });

    setActiveBlockId(null);
  };

  const splitBlockToColumns = (rowIndex: number, colId: string, blockId: string) => {
    setRows(prev => {
      const newRows = [...prev];
      const currentRow = newRows[rowIndex];
      const currentCol = currentRow.columns.find(c => c.id === colId);
      
      if (!currentCol) return prev;
      const blockIdx = currentCol.blocks.findIndex(b => b.id === blockId);
      const [blockToSplit] = currentCol.blocks.splice(blockIdx, 1);
      const splitRow: LobbyRow = {
        id: `row-split-${Date.now()}`,
        columns: [
          { id: `c1-${Date.now()}`, width: 50, blocks: [blockToSplit] },
          { id: `c2-${Date.now()}`, width: 50, blocks: [{ id: `b-new-${Date.now()}`, type: 'text' }] }
        ]
      };
      newRows.splice(rowIndex + 1, 0, splitRow);
      return newRows.filter(r => r.columns.some(c => c.blocks.length > 0));
    });
  };

  const addBlockInColumn = (rowId: string, colId: string, blockId: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return {
        ...row,
        columns: row.columns.map(col => {
          if (col.id !== colId) return col;
          const idx = col.blocks.findIndex(b => b.id === blockId);
          const newBlocks = [...col.blocks];
          newBlocks.splice(idx + 1, 0, { id: `b-${Date.now()}`, type: 'text' });
          return { ...col, blocks: newBlocks };
        })
      };
    }));
  };

  const deleteBlock = (rowId: string, colId: string, blockId: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      const updatedCols = row.columns.map(col => {
        if (col.id !== colId) return col;
        return { ...col, blocks: col.blocks.filter(b => b.id !== blockId) };
      }).filter(col => col.blocks.length > 0);

      const newWidth = 100 / updatedCols.length;
      return { ...row, columns: updatedCols.map(c => ({ ...c, width: newWidth })) };
    }).filter(r => r.columns.length > 0));
  };

  const renderBlock = (block: LobbyBlock) => {
    const p = { 
      onFocus: () => setActiveBlockId(block.id), 
      onSlash: () => setMenuType('slash') 
    };
    switch (block.type) {
      case "timer": return <TimerWidget {...p} />;
      case "todo": return <TodoWidget {...p} />;
      case "video": return <VideoWidget {...p} />;
      case "callout": return <CalloutWidget {...p} />;
      default: return <TextBoxWidget {...p} />;
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-[#0a0a0a] text-white p-8 overflow-y-auto">
      {/* slash */}
      {menuType === 'slash' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-[#1a1a1a] border border-[#333] rounded-xl z-[1000] p-2 shadow-2xl">
          {['text', 'todo', 'timer', 'video', 'callout'].map(type => (
            <button key={type} onClick={() => {
              setRows(prev => prev.map(r => ({
                ...r,
                columns: r.columns.map(c => ({
                  ...c,
                  blocks: c.blocks.map(b => b.id === activeBlockId ? { ...b, type } : b)
                }))
              })));
              setMenuType(null);
            }} className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg capitalize text-sm">{type}</button>
          ))}
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleManualReorder}>
        <div className="flex flex-col max-w-7xl mx-auto w-full">
          
          <RowDropZone id="dropzone-0" />

          {rows.map((row, rIdx) => (
            <div key={row.id} className="flex flex-col w-full">
              <div className="flex gap-4 w-full items-start">
                {row.columns.map((col) => (
                  <div key={col.id} style={{ width: `${col.width}%` }} className="flex flex-col gap-2 min-h-[50px]">
                    <SortableContext items={col.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                      {col.blocks.map(block => (
                        <SortableItem 
                          key={block.id} 
                          block={block} 
                          onDelete={() => deleteBlock(row.id, col.id, block.id)}
                          onAddBelow={() => addBlockInColumn(row.id, col.id, block.id)}
                          onAddColumn={() => splitBlockToColumns(rIdx, col.id, block.id)}
                          renderBlock={() => renderBlock(block)} 
                        />
                      ))}
                      <div id={col.id} className="h-4 w-full opacity-0 hover:opacity-10 transition-opacity bg-white/5 rounded" />
                    </SortableContext>
                  </div>
                ))}
              </div>
              
              <RowDropZone id={`dropzone-${rIdx + 1}`} />
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

const RowDropZone = ({ id }: { id: string }) => {
  const { setNodeRef, isOver } = useSortable({ id });
  return (
    <div 
      ref={setNodeRef} 
      className={`w-full transition-all duration-200 pointer-events-auto ${
        isOver 
          ? 'h-10 bg-blue-500/10 my-2 rounded-lg border-2 border-dashed border-blue-500/40 flex items-center justify-center text-blue-400/50 text-xs font-medium' 
          : 'h-4'
      }`}
    >
      {isOver && "Drop to create new row"}
    </div>
  );
};

export const SortableItem = ({ block, onDelete, onAddBelow, onAddColumn, renderBlock }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { 
    transform: CSS.Translate.toString(transform), 
    transition, 
    opacity: isDragging ? 0.3 : 1, 
    zIndex: isDragging ? 999 : 1 
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <WidgetWrapper 
        onDelete={onDelete}
        onAddBelow={onAddBelow} 
        onAddColumn={onAddColumn}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        {renderBlock()}
      </WidgetWrapper>
    </div>
  );
};