import { useState } from "react";

export const TodoList = () => {
  const [tasks, setTasks] = useState([{ id: 1, text: "Review Cornell Notes", completed: false }]);
  const [input, setInput] = useState("");

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput("");
  };

  return (
    <div className="border border-[var(--border-color)] bg-[var(--bg-sidebar)] rounded-xl flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
        <span className="text-[13px] font-bold">Tasks</span>
        <span className="text-[11px] text-[var(--text-muted)]">{tasks.filter(t => !t.completed).length} remaining</span>
      </div>
      
      <form onSubmit={addTask} className="p-4 border-b border-[var(--border-color)]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-md p-2 text-sm outline-none focus:border-[var(--primary)] transition-colors"
        />
      </form>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-md group">
            <input 
              type="checkbox" 
              checked={task.completed}
              onChange={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))}
              className="w-4 h-4 accent-[var(--primary)] bg-transparent border-[var(--border-color)] rounded"
            />
            <span className={`text-sm ${task.completed ? "line-through text-[var(--text-muted)]" : "text-[var(--text-main)]"}`}>
              {task.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};