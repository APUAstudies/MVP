import { useState, useEffect } from "react";

export const Timer = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-8 border border-[var(--border-color)] bg-[var(--bg-sidebar)] rounded-xl flex flex-col items-center gap-6 shadow-2xl">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Focus Session</span>
      <div className="text-7xl font-mono font-bold tracking-tighter text-[var(--text-main)]">
        {formatTime(seconds)}
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${
            isActive ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" : "bg-[var(--primary)] text-black"
          }`}
        >
          {isActive ? "Pause" : "Start Focus"}
        </button>
        <button 
          onClick={() => { setIsActive(false); setSeconds(25 * 60); }}
          className="px-6 py-2 rounded-md font-bold text-sm border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
        >
          Reset
        </button>
      </div>
    </div>
  );
};