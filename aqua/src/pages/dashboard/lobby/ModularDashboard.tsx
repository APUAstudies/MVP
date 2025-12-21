import { useState, useRef, useEffect } from "react";
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
import { WidgetWrapper } from './WidgetWrapper'; 
import { TextBoxWidget, TodoWidget, TimerWidget, VideoWidget, CalloutWidget } from "./Widgets";

interface LobbyBlock { 
  id: string; 
  type: string; 
  colorProps?: { text?: string; bg?: string; }; 
  autoFocus?: boolean;
}
interface LobbyColumn { id: string; width: number; blocks: LobbyBlock[]; }
interface LobbyRow { id: string; columns: LobbyColumn[]; }
interface PageData {
  id: string;
  title: string;
  content: LobbyRow[];
}

export const ModularDashboard = ({ 
    pageData, onSave 
  }: { 
    pageData: PageData; 
    onSave: (id: string, newContent: LobbyRow[]) => void 
  }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<LobbyRow[]>(pageData.content);
  const [focusTargetId, setFocusTargetId] = useState<string | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [menuType, setMenuType] = useState<'slash' | null>(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    setRows(pageData.content);
  }, [pageData.id, pageData.content]);

  const updateAndSave = (updateFn: (prev: LobbyRow[]) => LobbyRow[]) => {
    const nextRows = updateFn(rows);
    setRows(nextRows);
    onSave(pageData.id, nextRows);
  };

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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const selectBlock = (typeId: string) => {
    updateAndSave(prev => prev.map(r => ({
      ...r,
      columns: r.columns.map(c => ({
        ...c,
        blocks: c.blocks.map(b => b.id === activeBlockId ? { ...b, type: typeId } : b)
      }))
    })));
    setMenuType(null);
    setFilterText("");
  };

  const handleManualReorder = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    updateAndSave(currentRows => {
      let movedBlock: LobbyBlock | null = null;
      const rowsAfterRemoval = currentRows.map(row => ({
        ...row,
        columns: row.columns.map(col => {
          const bIdx = col.blocks.findIndex(b => b.id === active.id);
          if (bIdx !== -1) {
              const blocks = [...col.blocks];
              [movedBlock] = blocks.splice(bIdx, 1);
              return { ...col, blocks };
          }
          return col;
        })
      })); 

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
          const blocks = [...col.blocks];
          const overIdx = blocks.findIndex(b => b.id === over.id);
          if (overIdx !== -1) {
            blocks.splice(overIdx, 0, movedBlock!);
          } else if (col.id === over.id) {
            blocks.push(movedBlock!);
          }
          return { ...col, blocks };
        })
      }));
    });
    setActiveBlockId(null);
  };

  const splitBlockToColumns = (rowIndex: number, colId: string, blockId: string) => {
    updateAndSave(prev => {
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

  const deleteBlock = (rowId: string, colId: string, blockId: string) => {
    updateAndSave(prev => {
      let targetId: string | null = null;
      const row = prev.find(r => r.id === rowId);
      const col = row?.columns.find(c => c.id === colId);
      if (col) {
        const idx = col.blocks.findIndex(b => b.id === blockId);
        if (idx > 0) targetId = col.blocks[idx - 1].id;
      }
      setFocusTargetId(targetId);

      return prev.map(r => r.id === rowId ? {
        ...r,
        columns: r.columns.map(c => c.id === colId ? {
          ...c,
          blocks: c.blocks.filter(b => b.id !== blockId)
        } : c).filter(c => c.blocks.length > 0 || r.columns.length > 1)
      } : r).filter(r => r.columns.length > 0);
    });
  };

  const duplicateBlock = (rowId: string, colId: string, blockId: string) => {
    updateAndSave(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      return {
        ...row,
        columns: row.columns.map(col => {
          if (col.id !== colId) return col;
          const idx = col.blocks.findIndex(b => b.id === blockId);
          if (idx === -1) return col;
          const copy = { ...JSON.parse(JSON.stringify(col.blocks[idx])), id: `b-${Date.now()}` };
          const newBlocks = [...col.blocks];
          newBlocks.splice(idx + 1, 0, copy);
          return { ...col, blocks: newBlocks };
        })
      };
    }));
  };

  const updateBlockColor = (rowId: string, colId: string, blockId: string, colorClass: string, isBg: boolean) => {
    updateAndSave(prev => prev.map(row => row.id === rowId ? {
      ...row,
      columns: row.columns.map(col => col.id === colId ? {
        ...col,
        blocks: col.blocks.map(b => b.id === blockId ? {
          ...b,
          colorProps: { ...b.colorProps, [isBg ? 'bg' : 'text']: colorClass }
        } : b)
      } : col)
    } : row));
  };

  const updateBlockType = (rowId: string, colId: string, blockId: string, newType: string) => {
    updateAndSave(prev => prev.map(row => row.id === rowId ? {
      ...row,
      columns: row.columns.map(col => col.id === colId ? {
        ...col,
        blocks: col.blocks.map(block => block.id === blockId ? { ...block, type: newType } : block)
      } : col)
    } : row));
  };

  const addBlockInColumn = (rowId: string, colId: string, blockId: string) => {
    updateAndSave(prev => prev.map(row => row.id === rowId ? {
      ...row,
      columns: row.columns.map(col => {
        if (col.id !== colId) return col;
        const idx = col.blocks.findIndex(b => b.id === blockId);
        const newBlocks = [...col.blocks];
        newBlocks.splice(idx + 1, 0, { id: `b-${Date.now()}`, type: 'text', autoFocus: true });
        return { ...col, blocks: newBlocks };
      })
    } : row));
  };

  const handleColumnResize = (rowIndex: number, colIndex: number, newWidth: number) => {
    updateAndSave(prev => {
      const newRows = [...prev];
      const row = newRows[rowIndex];
      const col = row.columns[colIndex];
      const nextCol = row.columns[colIndex + 1];

      if (col && nextCol) {
        const totalWidth = col.width + nextCol.width;
        const clampedWidth = Math.min(Math.max(newWidth, 10), totalWidth - 10);
        col.width = clampedWidth;
        nextCol.width = totalWidth - clampedWidth;
      }
      return newRows;
    });
  };

  const renderBlock = (block: LobbyBlock, rowId: string, colId: string) => {
    const p = { 
      onFocus: () => setActiveBlockId(block.id), 
      onSlash: () => setMenuType('slash'),
      setFilterText,
      onCancelSlash: () => setMenuType(null),
      autoFocus: block.id === focusTargetId || block.autoFocus,
      onCommandEnter: () => filteredBlocks.length > 0 && selectBlock(filteredBlocks[0].id),
      onAddBelow: () => addBlockInColumn(rowId, colId, block.id),
      onDeleteBlock: () => deleteBlock(rowId, colId, block.id),
      onConvertToText: () => updateBlockType(rowId, colId, block.id, 'text'),
      colorProps: block.colorProps
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
            {filteredBlocks.map((block, index) => (
              <button key={block.id} onClick={() => selectBlock(block.id)} 
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${index === 0 ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-white/70'}`}>
                {block.label}
              </button>
            ))}
          </div>
        </>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleManualReorder}>
        <div className="flex flex-col max-w-7xl mx-auto w-full">
          <RowDropZone id="dropzone-0" />
          {rows.map((row, rIdx) => (
            <div key={row.id} className="flex flex-col w-full">
              <div className="flex gap-4 w-full items-start">
                {row.columns.map((col, cIdx) => (
                  <div key={col.id} style={{ width: `${col.width}%` }} className="relative flex flex-col gap-2 min-h-[50px]">
                    <SortableContext items={col.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                      {col.blocks.map(block => (
                        <SortableItem 
                          key={block.id} 
                          block={block}
                          onDelete={() => deleteBlock(row.id, col.id, block.id)}
                          onAddBelow={() => addBlockInColumn(row.id, col.id, block.id)}
                          onAddColumn={() => splitBlockToColumns(rIdx, col.id, block.id)}
                          onDuplicate={() => duplicateBlock(row.id, col.id, block.id)}
                          onConvert={(type: string) => updateBlockType(row.id, col.id, block.id, type)}
                          onUpdateColor={(color: string, isBg: boolean) => updateBlockColor(row.id, col.id, block.id, color, isBg)}
                          onResize={(newWidth: number) => handleColumnResize(rIdx, cIdx, newWidth)}
                          showResizer={cIdx < row.columns.length - 1}
                          renderBlock={() => renderBlock(block, row.id, col.id)}
                        />
                      ))}
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
  return <div ref={setNodeRef} className={`w-full transition-all duration-200 ${isOver ? 'h-10 bg-blue-500/10 my-2 border-2 border-dashed border-blue-500/40 flex items-center justify-center text-blue-400 text-xs' : 'h-4'}`}>
    {isOver && "Drop here to create new row"}
  </div>;
};

export const SortableItem = ({ 
  block, onDelete, onAddBelow, onAddColumn, onDuplicate, onConvert, onUpdateColor, onResize, showResizer, renderBlock 
}: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  const style = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <WidgetWrapper 
        onDelete={onDelete}
        onAddBelow={onAddBelow} 
        onAddColumn={onAddColumn}
        onDuplicate={onDuplicate}
        onConvert={onConvert}
        onResize={onResize}
        showResizer={showResizer}
        onUpdateColor={onUpdateColor}
        colorProps={block.colorProps}
        dragHandleProps={{ ...attributes, ...listeners }}
      >
        {renderBlock()}
      </WidgetWrapper>
    </div>
  );
};