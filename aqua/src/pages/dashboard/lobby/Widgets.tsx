import { useState, useEffect, useRef } from "react";

// --- COMMON INTERFACE ---
interface WidgetProps {
  onFocus?: () => void;
}

// --- CALLOUT ---
export const CalloutWidget = ({ onFocus }: WidgetProps) => {
  const [text, setText] = useState("Click to edit this callout");
  return (
    <div className="flex gap-3 items-center bg-white/5 p-4 rounded-lg border-l-4 border-[var(--primary)]">
      <span className="text-xl">💡</span>
      <input 
        onFocus={onFocus}
        value={text} 
        onChange={(e) => setText(e.target.value)}
        className="bg-transparent border-none outline-none text-sm text-white/90 w-full"
      />
    </div>
  );
};

// --- TEXT BOX (Auto-Expanding) ---
export const TextBoxWidget = ({ onFocus }: WidgetProps) => {
  const [text, setText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.endsWith('/')) {
      setText(val.slice(0, -1)); 
    } else {
      setText(val);
    }
  };

  return (
    <textarea 
      ref={textAreaRef}
      value={text}
      onFocus={onFocus}
      onChange={handleChange}
      placeholder="Type '/' for commands..."
      className="w-full bg-transparent border-none outline-none text-white resize-none text-sm min-h-[30px]"
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
            className="w-full bg-transparent border-none outline-none text-xs text-[var(--text-muted)] resize-none"
          />
        </div>
      )}
    </div>
  );
};

// --- VIDEO ---
export const VideoWidget = ({ onFocus }: WidgetProps) => {
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-inner" onFocus={onFocus} tabIndex={0}>
      <iframe 
        src="https://www.youtube.com/embed/jfKfPfyJRdk" 
        className="w-full h-full pointer-events-auto" 
        frameBorder="0" 
        allowFullScreen 
      />
    </div>
  );
};

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
      <div className="flex items-center justify-center h-[152px] text-[var(--text-muted)] text-xs italic">
        No embed URL provided
      </div>
  </div>
);

// --- TODO LIST ---
export const TodoWidget = ({ onFocus }: WidgetProps) => {
  const [tasks, setTasks] = useState([{ id: 1, text: "New Task", done: false }]);

  const addTask = () => setTasks([...tasks, { id: Date.now(), text: "", done: false }]);
  
  return (
    <div className="space-y-2" onFocus={onFocus}>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-2 group">
          <input 
            type="checkbox" 
            checked={task.done} 
            onChange={() => setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))}
            className="accent-[var(--primary)] w-4 h-4" 
          />
          <input 
            value={task.text}
            onChange={(e) => setTasks(tasks.map(t => t.id === task.id ? {...t, text: e.target.value} : t))}
            placeholder="To-do"
            className={`bg-transparent border-none outline-none text-sm w-full ${task.done ? 'line-through text-[var(--text-muted)]' : 'text-white'}`}
          />
        </div>
      ))}
      <button onClick={addTask} className="text-[10px] text-[var(--text-muted)] hover:text-white mt-2">+ Add item</button>
    </div>
  );
};

// --- TIMER ---
export const TimerWidget = ({ onFocus }: WidgetProps) => {
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const format = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="text-center py-2" onFocus={onFocus} tabIndex={0}>
      <div className="text-3xl font-mono font-bold text-[var(--primary)] tabular-nums">
        {format(seconds)}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        <button 
          onClick={() => setIsActive(!isActive)}
          className="text-[10px] bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full font-bold transition-colors"
        >
          {isActive ? 'PAUSE' : 'START'}
        </button>
        <button 
          onClick={() => { setIsActive(false); setSeconds(1500); }}
          className="text-[10px] text-[var(--text-muted)] hover:text-white transition-colors"
        >
          RESET
        </button>
      </div>
    </div>
  );
};