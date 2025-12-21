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
import { GripVertical } from "lucide-react";

interface WidgetProps {
  onFocus?: () => void;
  onSlash?: () => void;
  setFilterText?: (text: string) => void;
  onCommandEnter?: () => void;
  onCancelSlash?: () => void;
  onAddBelow?: () => void;
  onDeleteBlock?: () => void;
  onConvertToText?: () => void;
  autoFocus?: boolean;
  colorProps?: { text?: string; bg?: string };
}

// --- CALLOUT ---
export const CalloutWidget = ({ data, updateData, ...props }: any) => {
  return (
    <div className={`flex gap-3 items-start p-4 rounded-lg w-full ${props.colorProps?.bg || 'bg-white/5'}`}>
      <div className="flex-1 w-full">
        <TextBoxWidget data={data} updateData={updateData} {...props}/>
      </div>
    </div>
  );
};

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
  }, [data?.id]);

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
    if (e.key === 'Enter' && text.includes('/')) {
      e.preventDefault();
      onCommandEnter?.();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      if (text.trim() === "" || text === "/") {
        e.preventDefault();
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

// --- TOGGLE ---
export const ToggleWidget = ({ onFocus }: WidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");

  return (
    <div className="w-full" onFocus={onFocus}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 text-sm font-medium text-white hover:bg-white/5 w-full rounded p-1 transition-colors"
      >
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span> 
        Toggle List
      </button>
      {isOpen && (
        <div className="pl-6 mt-2 border-l border-white/10 ml-2">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Empty toggle. Type here..."
            className="w-full bg-transparent border-none outline-none text-xs text-white/50 resize-none"
          />
        </div>
      )}
    </div>
  );
};

// --- VIDEO ---
export const VideoWidget = ({ onFocus }: WidgetProps) => (
  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black" onFocus={onFocus} tabIndex={0}>
    <iframe src="https://www.youtube.com/embed/jfKfPfyJRdk" className="w-full h-full" allowFullScreen />
  </div>
);

// --- IMAGE ---
export const ImageWidget = ({ onFocus }: WidgetProps) => (
  <div className="relative group overflow-hidden rounded-lg" onFocus={onFocus} tabIndex={0}>
    <img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800" className="w-full object-cover max-h-80 transition-transform duration-500 group-hover:scale-105" alt="Workspace" />
    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
  </div>
);

// --- EMBED ---
export const EmbedWidget = ({ onFocus }: WidgetProps) => (
  <div className="w-full rounded-xl overflow-hidden bg-white/5 min-h-[152px]" onFocus={onFocus} tabIndex={0}>
      <div className="flex items-center justify-center h-[152px] text-white/40 text-xs italic">
        No embed URL provided
      </div>
  </div>
);

// --- TODO ---
export const TodoWidget = ({ colorProps, onConvertToText }: any) => {
  const [tasks, setTasks] = useState([
    { id: Date.now(), text: '', done: false, indent: 0 }
  ]);
  
  const [activeId, setActiveId] = useState<number | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const addTask = (afterId?: number) => {
    const newTask = { id: Date.now(), text: "", done: false, indent: 0 };
    if (afterId) {
      const idx = tasks.findIndex(t => t.id === afterId);
      const newTasks = [...tasks];
      newTask.indent = tasks[idx].indent;
      newTasks.splice(idx + 1, 0, newTask);
      setTasks(newTasks);
    } else {
      setTasks([...tasks, newTask]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, taskId: number, taskText: string, taskIndent: number) => {
    if (e.key === "Tab") {
      e.preventDefault(); 
      e.stopPropagation(); 
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          const newIndent = e.shiftKey ? Math.max(0, t.indent - 1) : Math.min(4, t.indent + 1);
          return { ...t, indent: newIndent };
        }
        return t;
      }));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      addTask(taskId);
    }

    if (e.key === "Backspace") {
      if (taskText === "") {
        e.preventDefault();
        if (taskIndent > 0) {
          setTasks(prev => prev.map(t => t.id === taskId ? { ...t, indent: t.indent - 1 } : t));
          return;
        }
        if (tasks.length === 1) {
          onConvertToText?.(); 
          return;
        }
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((t) => t.id === active.id);
        const newIndex = items.findIndex((t) => t.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        newItems[newIndex] = { ...newItems[newIndex], indent: items[newIndex].indent };
        return newItems;
      });
    }
    setActiveId(null);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex flex-col w-full">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTodoItem 
              key={task.id} 
              task={task} 
              tasks={tasks}
              setTasks={setTasks}
              handleKeyDown={handleKeyDown}
              colorProps={colorProps}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

const SortableTodoItem = ({ task, tasks, setTasks, handleKeyDown, colorProps }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { 
    transform: CSS.Translate.toString(transform), 
    transition, 
    opacity: isDragging ? 0.3 : 1,
    paddingLeft: `${task.indent * 20}px`
  };

  return (
    <div ref={setNodeRef} style={style} className="group/item flex items-center gap-1 py-0.5 w-full">
      <div 
        {...attributes} {...listeners} 
        className="opacity-0 group-hover/item:opacity-100 p-1 text-white/20 hover:text-white/60 cursor-grab"
      >
        <GripVertical size={14} />
      </div>

      <input 
        type="checkbox" 
        checked={task.done} 
        onChange={() => setTasks(tasks.map((t: any) => t.id === task.id ? {...t, done: !t.done} : t))}
        className="accent-blue-500 w-4 h-4 cursor-pointer bg-transparent border-white/20 rounded" 
      />
      
      <input 
        value={task.text}
        onKeyDown={(e) => handleKeyDown(e, task.id, task.text, task.indent)}
        onChange={(e) => setTasks(tasks.map((t: any) => t.id === task.id ? {...t, text: e.target.value} : t))}
        placeholder="To-do"
        className={`bg-transparent border-none outline-none text-sm w-full transition-colors ${
          task.done ? 'line-through text-white/40' : colorProps?.text || 'text-white'
        }`}
      />
    </div>
  );
};

// --- TIMER ---
export const TimerWidget = ({ onFocus, colorProps }: WidgetProps) => {
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) interval = setInterval(() => setSeconds(s => s - 1), 1000);
    else clearInterval(interval);
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className={`text-center py-2 rounded-lg ${colorProps?.bg || ''}`} onFocus={onFocus} tabIndex={0}>
      <div className={`text-3xl font-mono font-bold tabular-nums ${colorProps?.text || 'text-blue-500'}`}>
        {format(seconds)}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <button onClick={() => setIsActive(!isActive)} className="text-[10px] bg-white/10 px-3 py-1 rounded-full font-bold">{isActive ? 'PAUSE' : 'START'}</button>
        <button onClick={() => { setIsActive(false); setSeconds(1500); }} className="text-[10px] text-white/40">RESET</button>
      </div>
    </div>
  );
};