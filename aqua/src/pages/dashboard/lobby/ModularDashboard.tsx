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
  const [focusTargetId, setFocusTargetId] = useState<string | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [menuType, setMenuType] = useState<'slash' | null>(null);
  const [filterText, setFilterText] = useState("");
  const blockOptions = [
    { id: 'text', label: 'Text' },
    { id: 'todo', label: 'Todo' },
    { id: 'timer', label: 'Timer' },
    { id: 'video', label: 'Video' },
    { id: 'callout', label: 'Callout' },
  ];

  const filteredBlocks = blockOptions.filter(block => 
    block.label.toLowerCase().includes(filterText.toLowerCase())
  );

  const selectBlock = (typeId: string) => {
    setRows(prev => prev.map(r => ({
      ...r,
      columns: r.columns.map(c => ({
        ...c,
        blocks: c.blocks.map(b => b.id === activeBlockId ? { ...b, type: typeId } : b)
      }))
    })));
    setMenuType(null);
    setFilterText("");
  };

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
          if (bIdx !== -1) [movedBlock] = col.blocks.splice(bIdx, 1);
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
      const rowToSplit = newRows[rowIndex];
      const colToSplit = rowToSplit.columns.find(c => c.id === colId);
      if (!colToSplit) return prev;
      const blockIdx = colToSplit.blocks.findIndex(b => b.id === blockId);
      if (blockIdx === -1) return prev;

      const blocksAbove = colToSplit.blocks.slice(0, blockIdx);
      const targetBlock = colToSplit.blocks[blockIdx];
      const blocksBelow = colToSplit.blocks.slice(blockIdx + 1);
      const splitResult: LobbyRow[] = [];

      if (blocksAbove.length > 0) {
        splitResult.push({
          id: `row-top-${Date.now()}`,
          columns: [{ ...colToSplit, id: `c-top-${Date.now()}`, blocks: blocksAbove }]
        });
      }

      splitResult.push({
        id: `row-split-${Date.now()}`,
        columns: [
          { id: `c1-${Date.now()}`, width: 50, blocks: [targetBlock] },
          { id: `c2-${Date.now()}`, width: 50, blocks: [{ id: `b-empty-${Date.now()}`, type: 'text' }] }
        ]
      });

      if (blocksBelow.length > 0) {
        splitResult.push({
          id: `row-btm-${Date.now()}`,
          columns: [{ ...colToSplit, id: `c-btm-${Date.now()}`, blocks: blocksBelow }]
        });
      }
      newRows.splice(rowIndex, 1, ...splitResult);
      return newRows;
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
          const newBlockId = `b-${Date.now()}`;
          newBlocks.splice(idx + 1, 0, { 
            id: newBlockId, 
            type: 'text',
            autoFocus: true
          } as any); 

          return { ...col, blocks: newBlocks };
        })
      };
    }));
  };

  const deleteBlock = (rowId: string, colId: string, blockId: string) => {
  setRows(prev => {
    let targetId: string | null = null;
    const currentRow = prev.find(r => r.id === rowId);
    const currentCol = currentRow?.columns.find(c => c.id === colId);
    
    if (currentCol) {
      const idx = currentCol.blocks.findIndex(b => b.id === blockId);
      if (idx > 0) {
        targetId = currentCol.blocks[idx - 1].id;
      } else {
        // Find previous row/column logic can be added here
      }
    }
    setFocusTargetId(targetId);

    return prev.map(row => {
      if (row.id !== rowId) return row;
      const updatedCols = row.columns.map(col => {
        if (col.id !== colId) return col;
        return { ...col, blocks: col.blocks.filter(b => b.id !== blockId) };
      }).filter(col => col.blocks.length > 0);

      const newWidth = 100 / updatedCols.length;
      return { ...row, columns: updatedCols.map(c => ({ ...c, width: newWidth })) };
    }).filter(r => r.columns.length > 0);
  });
};

  const updateBlockType = (rowId: string, colId: string, blockId: string, newType: string) => {
    setRows(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return {
        ...row,
        columns: row.columns.map(col => {
          if (col.id !== colId) return col;
          return {
            ...col,
            blocks: col.blocks.map(block => 
              block.id === blockId ? { ...block, type: newType } : block
            )
          };
        })
      };
    }));
  };

  const renderBlock = (block: LobbyBlock, rowId: string, colId: string) => {
    const p = { 
      onFocus: () => setActiveBlockId(block.id), 
      onSlash: () => setMenuType('slash'),
      setFilterText: setFilterText,
      onCancelSlash: () => setMenuType(null),
      autoFocus: block.id === focusTargetId || (block as any).autoFocus,
      onCommandEnter: () => {
        if (filteredBlocks.length > 0) {
          selectBlock(filteredBlocks[0].id);
        }
      },
      onAddBelow: () => addBlockInColumn(rowId, colId, block.id),
      onDeleteBlock: () => deleteBlock(rowId, colId, block.id),
      onConvertToText: () => updateBlockType(rowId, colId, block.id, 'text'),
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
      {menuType === 'slash' && (
        <>
          <div className="fixed inset-0 z-[999]" onClick={() => {setMenuType(null); setFilterText(""); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 bg-[#1a1a1a] border border-[#333] rounded-xl z-[1000] p-2 shadow-2xl">
            {filteredBlocks.length > 0 ? (
              filteredBlocks.map((block, index) => (
                <button 
                  key={block.id} 
                  onClick={() => selectBlock(block.id)} 
                  className={`w-full text-left px-4 py-2 rounded-lg capitalize text-sm transition-colors 
                  ${ index === 0 ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/70'}`}
                >
                  {block.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-white/40 italic">No matching blocks found</div>
            )}
          </div>
        </>
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
                          renderBlock={() => renderBlock(block, row.id, col.id)}
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