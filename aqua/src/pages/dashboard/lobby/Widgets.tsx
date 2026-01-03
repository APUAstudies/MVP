import { useState, useEffect, useRef } from "react";
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
  useSortable,
  arrayMove 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Youtube } from "lucide-react";
import { WidgetWrapper } from './WidgetWrapper';

// --- TEXT BOX WIDGET ---
export const TextBoxWidget = ({ 
  data, updateData, onFocus, onSlash, setFilterText, onCommandEnter, onCancelSlash, onAddBelow, onDeleteBlock, autoFocus, colorProps
}: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef(data?.text || "");

  useEffect(() => {
    if (divRef.current && data?.text !== divRef.current.innerHTML) {
      divRef.current.innerHTML = data?.text || "";
      lastHtmlRef.current = data?.text || "";
    }
  }, [data?.id, data?.text]);

  useEffect(() => {
    if (autoFocus && divRef.current) {
      divRef.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(divRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [autoFocus]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const currentHtml = e.currentTarget.innerHTML;
    const currentText = e.currentTarget.innerText;

    lastHtmlRef.current = currentHtml;
    updateData({ text: currentHtml });

    const lastSlashIndex = currentText.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      const query = currentText.slice(lastSlashIndex + 1);
      if (!query.includes(' ')) {
        setFilterText?.(query);
        onSlash?.();
      }
    } else {
      onCancelSlash?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const text = divRef.current?.innerText || "";
    if (e.key === 'Enter' && e.shiftKey) {
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (text.includes('/')) {
        onCommandEnter?.();
      } else {
        onAddBelow?.();
      }
    }
    if (e.key === 'Backspace' && text === "") {
      e.preventDefault();
      onDeleteBlock?.();
    }
  };

  return (
    <div 
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      onBlur={() => setTimeout(() => onCancelSlash?.(), 200)}
      data-placeholder="Type '/' for commands..."
      className={`w-full bg-transparent border-none outline-none text-sm min-h-[30px] 
        empty:before:content-[attr(data-placeholder)] empty:before:text-white/20 
        px-1 py-1 ${colorProps?.text || 'text-white'}`}
    />
  );
};

export const CalloutWidget = ({ data, updateData, BlockRenderer, onDeleteBlock, ...props }: any) => {
  const cleanProps: any = { ...props };
  const colorProps = props.colorProps;
  delete cleanProps.onSlash;
  delete cleanProps.onFocus;
  delete cleanProps.setFilterText;
  delete cleanProps.onCommandEnter;
  delete cleanProps.onCancelSlash;
  const nestedBlocks = data?.nestedBlocks || [];
  const [activeNestedBlockId, setActiveNestedBlockId] = useState<string | null>(null);
  const [nestedMenuType, setNestedMenuType] = useState<'slash' | null>(null);

  const updateNestedBlock = (blockId: string, blockData: any) => {
    const updated = nestedBlocks.map((b: any) => 
      b.id === blockId ? { ...b, data: blockData } : b
    );
    updateData({ ...data, nestedBlocks: updated });
  };

  const updateNestedBlockColor = (blockId: string, color: string, isBg: boolean) => {
    const updated = nestedBlocks.map((b: any) => b.id === blockId ? { ...b, colorProps: { ...b.colorProps, [isBg ? 'bg' : 'text']: color } } : b);
    updateData({ ...data, nestedBlocks: updated });
  };

  const updateNestedBlockType = (blockId: string, newType: string) => {
    const updated = nestedBlocks.map((b: any) => {
      if (b.id === blockId) {
        const initialData = newType === 'callout' 
          ? { nestedBlocks: [{ id: `nb-${Date.now()}`, type: 'text', data: { text: '' } }] } 
          : newType === 'todo'
          ? { tasks: [{ id: Date.now(), text: '', done: false, indent: 0 }] }
          : {};
        return { ...b, type: newType, data: initialData };
      }
      return b;
    });
    updateData({ ...data, nestedBlocks: updated });
  };

  const addNestedBlock = (afterId?: string) => {
    const newBlock = { id: `nb-${Date.now()}`, type: 'text', data: { text: '' }, autoFocus: true };
    const foundIndex = nestedBlocks.findIndex((b: any) => b.id === afterId);
    const updated = [...nestedBlocks];
    if (foundIndex !== -1) {
      updated.splice(foundIndex + 1, 0, newBlock);
    } else {
      updated.push(newBlock);
    }
    updateData({ ...data, nestedBlocks: updated });
  };

  const deleteNestedBlock = (blockId: string) => {
    const updated = nestedBlocks.filter((b: any) => b.id !== blockId);
    if (updated.length === 0) {
      onDeleteBlock?.();
    } else {
      updateData({ ...data, nestedBlocks: updated });
    }
  };

  const NestedItem = ({ block }: { block: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });
    const style: any = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

    return (
      <div id={block.id} data-block-id={block.id} ref={setNodeRef} style={style} className="w-full">
        <div className="relative">
          <WidgetWrapper
            onDelete={() => deleteNestedBlock(block.id)}
            onAddBelow={() => addNestedBlock(block.id)}
            onConvert={(t: string) => updateNestedBlockType(block.id, t)}
            onUpdateColor={(c: string, isBg: boolean) => updateNestedBlockColor(block.id, c, isBg)}
            onDuplicate={() => {
              const copy = { ...block, id: `nb-${Date.now()}` };
              const idx = nestedBlocks.findIndex((b: any) => b.id === block.id);
              const updated = [...nestedBlocks];
              updated.splice(idx + 1, 0, copy);
              updateData({ ...data, nestedBlocks: updated });
            }}
            dragHandleProps={{ ...attributes, ...listeners }}
            showResizer={false}
            colorProps={block.colorProps}
            isNested={true}
          >
            <BlockRenderer
              {...cleanProps}
              colorProps={colorProps}
              block={block}
              onUpdateBlock={(newData: any) => updateNestedBlock(block.id, newData)}
              onAddBelow={() => addNestedBlock(block.id)}
              onDeleteBlock={() => deleteNestedBlock(block.id)}
              onFocus={() => setActiveNestedBlockId(block.id)}
              onSlash={() => { setActiveNestedBlockId(block.id); setNestedMenuType('slash'); }}
              onConvert={(newType: string) => updateNestedBlockType(block.id, newType)}
              activeBlockId={activeNestedBlockId}
              autoFocus={block.autoFocus}
            />
          </WidgetWrapper>
        </div>
      </div>
    );
  };

  return (
      <>
      {nestedMenuType === 'slash' && activeNestedBlockId && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40" onClick={() => setNestedMenuType(null)}>
          <div className="w-64 bg-[#1a1a1a] border border-white/10 rounded-xl p-2" onClick={e => e.stopPropagation()}>
            {['text', 'todo', 'timer', 'video', 'callout'].map(type => (
              <button 
                key={type} 
                onClick={() => { updateNestedBlockType(activeNestedBlockId, type); setNestedMenuType(null); }} 
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/10 capitalize"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
    <div className="w-full my-4 rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">

      {/* Nested blocks container */}
      <div className="p-4 flex flex-col gap-2 min-h-[60px]">
        {nestedBlocks.length > 0 ? (
          <SortableContext items={nestedBlocks.map((b: any) => b.id)} strategy={verticalListSortingStrategy}>
            {nestedBlocks.map((block: any) => (
              <NestedItem key={block.id} block={block} />
            ))}
          </SortableContext>
        ) : (
          <div className="text-white/20 text-xs py-4 text-center italic">Drag blocks here or click add</div>
        )}
      </div>
    </div>
    </>
  );
};


// --- VIDEO WIDGET ---
export const VideoWidget = ({ data, updateData, onFocus }: any) => {
  const videoUrl = data?.url || "";

  const handleSetVideo = () => {
    const newUrl = prompt("Paste YouTube URL here:", videoUrl);
    if (newUrl !== null) {
      updateData({ ...data, url: newUrl });
    }
  };

  const getYoutubeID = (url: string) => {
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  };

  const videoID = getYoutubeID(videoUrl);

  return (
    <div className="w-full group relative" onFocus={onFocus} tabIndex={0}>
      {videoID ? (
        <div className="aspect-video rounded-lg overflow-hidden bg-black border border-white/10">
          <iframe 
            src={`https://www.youtube.com/embed/${videoID}`} 
            className="w-full h-full" 
            allowFullScreen 
          />
          <button 
            onClick={handleSetVideo}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/80 text-white text-[10px] px-2 py-1 rounded border border-white/20 transition-all"
          >
            Change URL
          </button>
        </div>
      ) : (
        <div 
          onClick={handleSetVideo}
          className="aspect-video rounded-lg bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
        >
          <Youtube className="text-red-500 mb-2" size={32} />
          <span className="text-xs text-white/40">Click to embed YouTube video</span>
        </div>
      )}
    </div>
  );
};

// --- TODO WIDGET ---
export const TodoWidget = ({ data, updateData, colorProps, onConvertToText }: any) => {
  const tasks = data?.tasks ?? [];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const syncTasks = (newTasks: any[]) => {
    updateData({ tasks: newTasks });
  };

  const addTask = (afterId?: number) => {
    const newTask = { id: Date.now(), text: "", done: false, indent: 0 };
    const idx = tasks.findIndex((t: any) => t.id === afterId);
    const newTasks = [...tasks];
    if (idx !== -1) {
      newTask.indent = tasks[idx].indent;
      newTasks.splice(idx + 1, 0, newTask);
    } else {
      newTasks.push(newTask);
    }
    syncTasks(newTasks);
  };

  const handleKeyDown = (e: React.KeyboardEvent, taskId: number, taskText: string, taskIndent: number) => {
    if (e.key === "Tab") {
      e.preventDefault(); 
      syncTasks(tasks.map((t: any) => t.id === taskId ? { ...t, indent: e.shiftKey ? Math.max(0, t.indent - 1) : Math.min(4, t.indent + 1) } : t));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      addTask(taskId);
    }
    if (e.key === "Backspace" && taskText === "") {
      e.preventDefault();
      if (taskIndent > 0) {
        syncTasks(tasks.map((t: any) => t.id === taskId ? { ...t, indent: t.indent - 1 } : t));
      } else if (tasks.length > 1) {
        syncTasks(tasks.filter((t: any) => t.id !== taskId));
      } else {
        onConvertToText?.();
      }
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={(e) => {
      const { active, over } = e;
      if (over && active.id !== over.id) {
        const oldIndex = tasks.findIndex((t: any) => t.id === active.id);
        const newIndex = tasks.findIndex((t: any) => t.id === over.id);
        syncTasks(arrayMove(tasks, oldIndex, newIndex));
      }
    }}>
      <div className="flex flex-col w-full">
        <SortableContext items={tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task: any) => (
            <SortableTodoItem 
              key={task.id} 
              task={task} 
              tasks={tasks}
              setTasks={syncTasks}
              handleKeyDown={handleKeyDown}
              colorProps={colorProps}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

const SortableTodoItem = ({ task, tasks, setTasks, handleKeyDown }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { 
    transform: CSS.Translate.toString(transform), 
    transition, 
    opacity: isDragging ? 0.3 : 1,
    paddingLeft: `${task.indent * 20}px`
  };

  return (
    <div ref={setNodeRef} style={style} className="group/item flex items-center gap-1 py-0.5 w-full">
      <div {...attributes} {...listeners} className="opacity-0 group-hover/item:opacity-100 p-1 text-white/20 cursor-grab">
        <GripVertical size={14} />
      </div>
      <input 
        type="checkbox" 
        checked={task.done} 
        onChange={() => setTasks(tasks.map((t: any) => t.id === task.id ? {...t, done: !t.done} : t))}
        className="accent-blue-500 w-4 h-4 cursor-pointer" 
      />
      <input 
        value={task.text}
        onKeyDown={(e) => handleKeyDown(e, task.id, task.text, task.indent)}
        onChange={(e) => setTasks(tasks.map((t: any) => t.id === task.id ? {...t, text: e.target.value} : t))}
        placeholder="To-do"
        className={`bg-transparent border-none outline-none text-sm w-full ${task.done ? 'line-through text-white/40' : 'text-white'}`}
      />
    </div>
  );
};

// --- TIMER WIDGET ---
export const TimerWidget = ({ colorProps }: any) => {
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) interval = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="text-center py-2">
      <div className={`text-3xl font-mono font-bold ${colorProps?.text || 'text-blue-500'}`}>{format(seconds)}</div>
      <div className="flex justify-center gap-2 mt-2">
        <button onClick={() => setIsActive(!isActive)} className="text-[10px] bg-white/10 px-2 py-1 rounded">{isActive ? 'PAUSE' : 'START'}</button>
        <button onClick={() => { setIsActive(false); setSeconds(1500); }} className="text-[10px] text-white/40">RESET</button>
      </div>
    </div>
  );
};

export const WIDGET_COMPONENTS: Record<string, React.ComponentType<any>> = {
  text: TextBoxWidget,
  todo: TodoWidget,
  timer: TimerWidget,
  video: VideoWidget,
  callout: CalloutWidget
};