import { useState, useEffect, useCallback, useRef } from "react";
import { 
  DndContext, 
  rectIntersection,
  PointerSensor, 
  useSensor, 
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WidgetWrapper } from './WidgetWrapper'; 
import { WIDGET_COMPONENTS } from "./Widgets";

const BlockRenderer = (props: any) => {
  const { block, onUpdateBlock } = props;
  const Widget = WIDGET_COMPONENTS[block.type] || WIDGET_COMPONENTS.text;

  return (
    <Widget
      {...props}
      data={block.data}
      updateData={onUpdateBlock}
      BlockRenderer={BlockRenderer}
    />
  );
};

export const ModularDashboard = ({ 
    pageData, onSave 
  }: { 
    pageData: any; 
    onSave: (id: string, newContent: any[]) => void 
  }) => {
  const [rows, setRows] = useState<any[]>(pageData.content);
  const [focusTargetId, setFocusTargetId] = useState<string | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [dragIndicator, setDragIndicator] = useState<any | null>(null);
  const latestDropRef = useRef<any | null>(null);
  const [menuType, setMenuType] = useState<'slash' | null>(null);

  useEffect(() => {
    setRows(pageData.content);
  }, [pageData.id, pageData.content]);

  const updateAndSave = useCallback((updateFn: (prev: any[]) => any[]) => {
    setRows(prev => {
      const nextRows = updateFn(prev);
      onSave(pageData.id, nextRows);
      return nextRows;
    });
  }, [pageData.id, onSave]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const findBlockPosition = (rowsArg: any[], id: string) => {
    for (let ri = 0; ri < rowsArg.length; ri++) {
      const row = rowsArg[ri];
      for (let ci = 0; ci < row.columns.length; ci++) {
        const col = row.columns[ci];
        const bi = col.blocks.findIndex((b: any) => b.id === id);
        if (bi !== -1) return { rowIndex: ri, colIndex: ci, blockIndex: bi, nested: false };
        for (let biTop = 0; biTop < col.blocks.length; biTop++) {
          const b = col.blocks[biTop];
          if (b.type === 'callout' && b.data?.nestedBlocks) {
            const nIdx = b.data.nestedBlocks.findIndex((nb: any) => nb.id === id);
            if (nIdx !== -1) return { rowIndex: ri, colIndex: ci, blockIndex: biTop, nested: true, nestedIndex: nIdx };
          }
        }
      }
    }
    return null;
  };

  const updateBlockData = (blockId: string, newData: any) => {
    updateAndSave(prev => prev.map(row => ({
      ...row,
      columns: row.columns.map((col: any) => ({
        ...col,
        blocks: col.blocks.map((block: any) => {
          if (block.id === blockId) return { ...block, data: newData };
          if (block.type === 'callout' && block.data?.nestedBlocks) {
            return {
              ...block,
              data: {
                ...block.data,
                nestedBlocks: block.data.nestedBlocks.map((nb: any) => 
                  nb.id === blockId ? { ...nb, data: newData } : nb
                )
              }
            };
          }
          return block;
        })
      }))
    })));
  };

  const updateBlockType = (blockId: string, newType: string) => {
    updateAndSave(prev => prev.map(row => ({
      ...row,
      columns: row.columns.map((col: any) => {
        const updatedBlocks = col.blocks.map((block: any) => {
          
          if (block.type === 'callout' && block.data?.nestedBlocks) {
            const nestedIdx = block.data.nestedBlocks.findIndex((nb: any) => nb.id === blockId);
            
            if (nestedIdx !== -1) {
              const newNested = [...block.data.nestedBlocks];
              newNested[nestedIdx] = { 
                ...newNested[nestedIdx], 
                type: newType, 
                data: newType === 'todo' ? { tasks: [{ id: Date.now(), text: '', done: false, indent: 0 }] } : {} 
              };
              
              return { ...block, data: { ...block.data, nestedBlocks: newNested } };
            }
          }

          if (block.id === blockId) {
            const initialData = newType === 'callout' 
              ? { nestedBlocks: [{ id: `nb-${Date.now()}`, type: 'text', data: { text: '' } }] } 
              : newType === 'todo'
              ? { tasks: [{ id: Date.now(), text: '', done: false, indent: 0 }] }
              : {};
              
            return { ...block, type: newType, data: initialData };
          }
          return block;
        });
        return { ...col, blocks: updatedBlocks };
      })
    })));
  };

  const deleteBlock = (rowId: string, colId: string, blockId: string) => {
    updateAndSave(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      return {
        ...r,
        columns: r.columns.map((c: any) =>
          c.id === colId ? { ...c, blocks: c.blocks.filter((b: any) => b.id !== blockId) } : c
        ).filter((c: any) => c.blocks.length > 0 || r.columns.length > 1)
      };
    }).filter(r => r.columns.length > 0));
  };

  const splitBlockToColumns = (rowIndex: number, colId: string, blockId: string) => {
    updateAndSave(prev => {
      const newRows = [...prev];
      const row = newRows[rowIndex];
      if (row.columns.length >= 4) return prev;

      const colIndex = row.columns.findIndex((c: any) => c.id === colId);
      const colToSplit = row.columns[colIndex];
      const blockIdx = colToSplit.blocks.findIndex((b: any) => b.id === blockId);
      if (blockIdx === -1) return prev;
      
      const [targetBlock] = colToSplit.blocks.splice(blockIdx, 1);
      row.columns.splice(colIndex + 1, 0, {
        id: `c-${Date.now()}`,
        width: 0,
        blocks: [targetBlock]
      });

      const equalWidth = 100 / row.columns.length;
      row.columns.forEach((c: any) => c.width = equalWidth);
      return newRows;
    });
  };

  const updateBlockColor = (blockId: string, color: string, isBg: boolean) => {
    updateAndSave(prev => prev.map(row => ({
      ...row,
      columns: row.columns.map((col: any) => ({
        ...col,
        blocks: col.blocks.map((b: any) => b.id === blockId ? {
          ...b,
          colorProps: { ...b.colorProps, [isBg ? 'bg' : 'text']: color }
        } : b)
      }))
    })));
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

  const addBlockInColumn = (rowId: string, colId: string, blockId: string) => {
    const newId = `b-${Date.now()}`;
    setFocusTargetId(newId);
    
    updateAndSave(prev => prev.map(row => {
      if (row.id !== rowId) return row;
      
      return {
        ...row,
        columns: row.columns.map((col: any) => {
          if (col.id !== colId) return col;

          const topIdx = col.blocks.findIndex((b: any) => b.id === blockId);
          if (topIdx !== -1) {
            const newBlocks = [...col.blocks];
            newBlocks.splice(topIdx + 1, 0, { id: newId, type: 'text', data: { text: '' }, autoFocus: true });
            return { ...col, blocks: newBlocks };
          }

          return {
            ...col,
            blocks: col.blocks.map((block: any) => {
              if (block.type === 'callout' && block.data?.nestedBlocks) {
                const nestedIdx = block.data.nestedBlocks.findIndex((nb: any) => nb.id === blockId);
                if (nestedIdx !== -1) {
                  const newNested = [...block.data.nestedBlocks];
                  newNested.splice(nestedIdx + 1, 0, { id: newId, type: 'text', data: { text: '' }, autoFocus: true });
                  return { ...block, data: { ...block.data, nestedBlocks: newNested } };
                }
              }
              return block;
            })
          };
        })
      };
    }));
  };

  const handleManualReorder = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let movedId: string | null = null;

    updateAndSave(currentRows => {
      // helper to deep-copy rows/columns/blocks (one level deep for blocks)
      const rowsCopy = currentRows.map(r => ({
        ...r,
        columns: r.columns.map((c: any) => ({ ...c, blocks: [...c.blocks] }))
      }));

      // find a block by id in top-level blocks or nested callout blocks
      const findBlockPosition = (rows: any[], id: string) => {
        for (let ri = 0; ri < rows.length; ri++) {
          const row = rows[ri];
          for (let ci = 0; ci < row.columns.length; ci++) {
            const col = row.columns[ci];
            const bi = col.blocks.findIndex((b: any) => b.id === id);
            if (bi !== -1) return { rowIndex: ri, colIndex: ci, blockIndex: bi, nested: false };
            // nested inside callout
            for (let biTop = 0; biTop < col.blocks.length; biTop++) {
              const b = col.blocks[biTop];
              if (b.type === 'callout' && b.data?.nestedBlocks) {
                const nIdx = b.data.nestedBlocks.findIndex((nb: any) => nb.id === id);
                if (nIdx !== -1) return { rowIndex: ri, colIndex: ci, blockIndex: biTop, nested: true, nestedIndex: nIdx };
              }
            }
          }
        }
        return null;
      };

      // locate active (moving) block
      const activePos = findBlockPosition(rowsCopy, String(active.id));
      if (!activePos) return currentRows;

      // extract moved block
      let movedBlock: any = null;
      if (activePos.nested) {
        const parent = rowsCopy[activePos.rowIndex].columns[activePos.colIndex].blocks[activePos.blockIndex];
        movedBlock = parent.data.nestedBlocks.splice(activePos.nestedIndex, 1)[0];
      } else {
        movedBlock = rowsCopy[activePos.rowIndex].columns[activePos.colIndex].blocks.splice(activePos.blockIndex, 1)[0];
      }

      // mark moved block to autoFocus after move
      try {
        movedBlock = { ...movedBlock, autoFocus: true };
        movedId = String(movedBlock.id);
      } catch {}

      // handle dropzone targets
      const overId = String(over.id);
      if (overId.startsWith('dropzone-')) {
        const parts = overId.split('-');
        const insertAt = Math.max(0, Math.min(rowsCopy.length, Number(parts[1]) || 0));
        if (insertAt < rowsCopy.length) {
          const targetRow = rowsCopy[insertAt];
          const targetColIndex = Math.min(targetRow.columns.length - 1, Math.max(0, activePos?.colIndex ?? 0));
          targetRow.columns[targetColIndex].blocks.push(movedBlock);
          return rowsCopy;
        }

        const newRow = {
          id: `r-${Date.now()}`,
          columns: [{ id: `c-${Date.now()}`, width: 100, blocks: [movedBlock] }]
        };
        rowsCopy.splice(insertAt, 0, newRow);
        return rowsCopy;
      }

      // if over a column dropzone (empty or narrow column), insert into that column
      if (overId.startsWith('col-')) {
        const parts = overId.split('-');
        const rIdx = Number(parts[1]);
        const cIdx = Number(parts[2]);
        if (!Number.isNaN(rIdx) && !Number.isNaN(cIdx) && rowsCopy[rIdx] && rowsCopy[rIdx].columns[cIdx]) {
          const latest = latestDropRef.current;
          // if user hovered near the left/right side, create a new column
          if (latest && latest.type === 'col' && (latest.side === 'left' || latest.side === 'right') && latest.rowIndex === rIdx && latest.colIndex === cIdx) {
            const insertAt = latest.side === 'right' ? cIdx + 1 : cIdx;
            const newCol = { id: `c-${Date.now()}`, width: 0, blocks: [movedBlock] };
            rowsCopy[rIdx].columns.splice(insertAt, 0, newCol);
            const equalWidth = 100 / rowsCopy[rIdx].columns.length;
            rowsCopy[rIdx].columns.forEach((c: any) => c.width = equalWidth);
            return rowsCopy;
          }
          rowsCopy[rIdx].columns[cIdx].blocks.push(movedBlock);
          return rowsCopy;
        }
      }

      const overPos = findBlockPosition(rowsCopy, overId);
      if (!overPos) return rowsCopy;

      if (overPos.nested) {
        const parent = rowsCopy[overPos.rowIndex].columns[overPos.colIndex].blocks[overPos.blockIndex];
        const latest = latestDropRef.current;
        let destIdx = overPos.nestedIndex;
        
        if (latest && latest.type === 'nested' && latest.pointerY !== undefined && latest.blockPositions && latest.blockPositions.length > 0) {
          const pointerY = latest.pointerY;
          let preciseIndex = 0;
          
          for (let i = 0; i < latest.blockPositions.length; i++) {
            const blockPos = latest.blockPositions[i];
            const midpoint = blockPos.top + blockPos.height / 2;
            if (pointerY >= midpoint) {
              preciseIndex = i + 1;
            } else {
              break;
            }
          }
          
          destIdx = Math.min(preciseIndex, parent.data.nestedBlocks.length);
        } else if (latest && latest.type === 'nested' && latest.position === 'after') {
          destIdx = overPos.nestedIndex + 1;
        }
        
        parent.data.nestedBlocks.splice(destIdx, 0, movedBlock);
        return rowsCopy;
      }

      const latest = latestDropRef.current;
      let destIndex = overPos.blockIndex;
      
      if (latest && latest.type === 'block' && latest.pointerY !== undefined && latest.blockPositions && latest.blockPositions.length > 0) {
        const pointerY = latest.pointerY;
        const targetCol = rowsCopy[overPos.rowIndex].columns[overPos.colIndex];
        let preciseIndex = 0;
        
        for (let i = 0; i < latest.blockPositions.length; i++) {
          const blockPos = latest.blockPositions[i];
          const midpoint = blockPos.top + blockPos.height / 2;
          if (pointerY >= midpoint) {
            preciseIndex = i + 1;
          } else {
            break;
          }
        }
        
        destIndex = Math.min(preciseIndex, targetCol.blocks.length);
      } else if (latest && latest.type === 'block' && latest.position === 'after') {
        destIndex = overPos.blockIndex + 1;
      }

      rowsCopy[overPos.rowIndex].columns[overPos.colIndex].blocks.splice(destIndex, 0, movedBlock);
      return rowsCopy;
    });
    if (movedId) {
      setTimeout(() => setFocusTargetId(movedId), 50);
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    pointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveBlockId(String(active.id));
    window.addEventListener('pointermove', onPointerMove);
    setDragIndicator(null);
  };

  const handleDragOver = (event: any) => {
    const { over } = event;
    if (!over) {
      setDragIndicator(null);
      return;
    }

    const overId = String(over.id);
    if (overId.startsWith('dropzone-')) {
      const el = document.querySelector(`[data-dropzone="${overId}"]`) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        const info = { type: 'row', top: rect.top + window.scrollY + rect.height / 2, left: rect.left + window.scrollX, width: rect.width, overId };
        latestDropRef.current = info;
        setDragIndicator(info);
        return;
      }
    }

    if (overId.startsWith('col-')) {
      const parts = overId.split('-');
      const rIdx = Number(parts[1]);
      const cIdx = Number(parts[2]);
      const colEl = document.querySelector(`[data-col="${rIdx}-${cIdx}"]`) as HTMLElement | null;
      if (colEl) {
        const rect = colEl.getBoundingClientRect();
        const px = pointerRef.current.x;
        const side = (px - rect.left) < 24 ? 'left' : (rect.right - px) < 24 ? 'right' : 'center';
        const info = { type: 'col', rect: { top: rect.top + window.scrollY, left: rect.left + window.scrollX, width: rect.width, height: rect.height }, rowIndex: rIdx, colIndex: cIdx, side, overId };
        latestDropRef.current = info;
        setDragIndicator(info);
        return;
      }
    }

    const el = document.getElementById(overId) as HTMLElement | null;
    if (el) {
      const rect = el.getBoundingClientRect();
      const pos = findBlockPosition(rows, overId);
      if (pos && !pos.nested) {
        const blockObj = rows[pos.rowIndex].columns[pos.colIndex].blocks[pos.blockIndex];
        if (blockObj && blockObj.type === 'callout' && blockObj.data?.nestedBlocks && blockObj.data.nestedBlocks.length > 0) {
          const py = pointerRef.current.y || (rect.top + rect.height / 2);
          const position = (py - rect.top) < (rect.height / 2) ? 'before' : 'after';

          let blockPositions: any[] = [];
          const nestedBlocks = blockObj.data.nestedBlocks;
          blockPositions = nestedBlocks.map((b: any) => {
            const blockEl = document.getElementById(b.id) as HTMLElement | null;
            if (blockEl) {
              const bRect = blockEl.getBoundingClientRect();
              return { id: b.id, top: bRect.top + window.scrollY, height: bRect.height };
            }
            return null;
          }).filter((p: any) => p !== null);

          const info = { type: 'nested', top: (position === 'before' ? rect.top : rect.bottom) + window.scrollY, left: rect.left + window.scrollX, width: rect.width, position, overId, pointerY: py + window.scrollY, blockPositions };
          latestDropRef.current = info;
          setDragIndicator(info);
          return;
        // } else if (blockObj && blockObj.type === 'callout') {
        //   // empty callout: show snap square
        //   const info = { type: 'callout', rect: { top: rect.top + window.scrollY, left: rect.left + window.scrollX, width: rect.width, height: rect.height }, overId };
        //   latestDropRef.current = info;
        //   setDragIndicator(info);
        //   return;
        }
      }

      const py = pointerRef.current.y || (rect.top + rect.height / 2);
      const position = (py - rect.top) < (rect.height / 2) ? 'before' : 'after';
      let blockPositions: any[] = [];
      if (pos && !pos.nested) {
        const col = rows[pos.rowIndex].columns[pos.colIndex];
        blockPositions = col.blocks.map((b: any) => {
          const blockEl = document.getElementById(b.id) as HTMLElement | null;
          if (blockEl) {
            const bRect = blockEl.getBoundingClientRect();
            return { id: b.id, top: bRect.top + window.scrollY, height: bRect.height };
          }
          return null;
        }).filter((p: any) => p !== null);
      }
      
      const info = { type: 'block', top: (position === 'before' ? rect.top : rect.bottom) + window.scrollY, left: rect.left + window.scrollX, width: rect.width, position, overId, pointerY: py + window.scrollY, blockPositions };
      latestDropRef.current = info;
      setDragIndicator(info);
      return;
    }

    setDragIndicator(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white p-8">
      {menuType === 'slash' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40" onClick={() => setMenuType(null)}>
          <div className="w-64 bg-[#1a1a1a] border border-white/10 rounded-xl p-2" onClick={e => e.stopPropagation()}>
            {['text', 'todo', 'timer', 'video', 'callout'].map(type => (
              <button 
                key={type} 
                onClick={() => { if (activeBlockId) updateBlockType(activeBlockId, type); setMenuType(null); }} 
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 capitalize"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={(event) => {
          window.removeEventListener('pointermove', onPointerMove);
          handleManualReorder(event);
          latestDropRef.current = null;
          setDragIndicator(null);
          setActiveBlockId(null);
        }}
      >
        {dragIndicator && (
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 60 }}>
            {dragIndicator.type === 'block' && (
              <div style={{ position: 'fixed', top: dragIndicator.top + 'px', left: dragIndicator.left + 'px', width: dragIndicator.width + 'px' }}>
                <div style={{ height: 4, background: 'linear-gradient(90deg,#60a5fa,#3b82f6)', borderRadius: 2 }} />
              </div>
            )}
            {dragIndicator.type === 'row' && (
              <div style={{ position: 'fixed', top: dragIndicator.top + 'px', left: dragIndicator.left + 'px', width: dragIndicator.width + 'px' }}>
                <div style={{ height: 4, background: '#3b82f6', borderRadius: 2, opacity: 0.95 }} />
              </div>
            )}
            {dragIndicator.type === 'col' && (
              (() => {
                const r = dragIndicator.rect;
                const leftX = dragIndicator.side === 'left' ? r.left : (dragIndicator.side === 'right' ? r.left + r.width : r.left + 6);
                const height = r.height;
                return (
                  <div style={{ position: 'fixed', top: r.top + 'px', left: leftX + 'px', height: height + 'px', width: 4 }}>
                    <div style={{ height: '100%', width: '100%', background: '#3b82f6', borderRadius: 2, opacity: 0.9 }} />
                  </div>
                );
              })()
            )}
            {dragIndicator.type === 'callout' && (
              (() => {
                const r = dragIndicator.rect;
                const size = Math.min(320, r.width - 24, r.height - 24);
                const left = r.left + (r.width - size) / 2;
                const top = r.top + (r.height - size) / 2;
                return (
                  <div style={{ position: 'fixed', top: top + 'px', left: left + 'px', width: size + 'px', height: size + 'px' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: 10, border: '2px solid rgba(59,130,246,0.9)', background: 'rgba(59,130,246,0.06)' }} />
                  </div>
                );
              })()
            )}
          </div>
        )}

        <div className="flex flex-col max-w-7xl mx-auto w-full gap-4">
          <RowDropZone id="dropzone-0" />
          {rows.map((row, rIdx) => (
            <div key={row.id} className="flex flex-col w-full">
              <div className="flex gap-4 w-full items-start group/row">
                {row.columns.map((col: any, cIdx: number) => (
                  <div key={col.id} data-col={`${rIdx}-${cIdx}`} style={{ width: `${col.width}%` }} className="flex flex-col gap-2 relative">
                    <ColumnDropZone id={`col-${rIdx}-${cIdx}`} />
                    <SortableContext items={col.blocks.map((b: any) => b.id)} strategy={verticalListSortingStrategy}>
                      {col.blocks.map((block: any) => (
                        <SortableItem 
                          key={block.id} 
                          block={block}
                          onDelete={() => deleteBlock(row.id, col.id, block.id)}
                          onAddBelow={() => addBlockInColumn(row.id, col.id, block.id)} // For the UI button
                          onAddColumn={() => splitBlockToColumns(rIdx, col.id, block.id)}
                          onUpdateColor={(c: string, isBg: boolean) => updateBlockColor(block.id, c, isBg)}
                          onResize={(newW: number) => handleColumnResize(rIdx, cIdx, newW)}
                          showResizer={cIdx < row.columns.length - 1}
                          renderBlock={() => (
                            <BlockRenderer 
                              block={block}
                              onUpdateBlock={(newData: any) => updateBlockData(block.id, newData)}
                              onFocus={() => setActiveBlockId(block.id)}
                              onSlash={() => { setActiveBlockId(block.id); setMenuType('slash'); }}
                              onAddBelow={() => addBlockInColumn(row.id, col.id, block.id)} // For the Enter key
                              autoFocus={block.id === focusTargetId || block.autoFocus}
                            />
                          )}
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

const SortableItem = ({ block, renderBlock, onResize, showResizer, ...wrapperProps }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
  return (
    <div
      id={block.id}
      data-block-id={block.id}
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.3 : 1 }}
    >
      <WidgetWrapper 
        {...wrapperProps} 
        onResize={onResize}
        showResizer={showResizer}
        dragHandleProps={{ ...attributes, ...listeners }} 
        colorProps={block.colorProps}
      >
        {renderBlock()}
      </WidgetWrapper>
    </div>
  );
};

const RowDropZone = ({ id }: { id: string }) => {
  const { setNodeRef, isOver } = useSortable({ id });
  return (
    <div 
      ref={setNodeRef}
      data-dropzone={id}
      className={`w-full transition-all duration-200 ${isOver ? 'h-10 bg-blue-500/10 my-2 border-2 border-dashed border-blue-500/40 flex items-center justify-center text-blue-400 text-xs' : 'h-4'}`}
    >
      {isOver && "Drop here to create new row"}
    </div>
  );
};

const ColumnDropZone = ({ id }: { id: string }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="absolute inset-0 pointer-events-auto">
      <div className={`w-full h-full ${isOver ? 'bg-white/5 outline outline-2 outline-white/10' : ''}`} />
    </div>
  );
};