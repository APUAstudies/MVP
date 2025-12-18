import { Timer } from "../components/dashboard/Pomodoro"
import { TodoList } from "../components/dashboard/TodoList"
import { NoteEditor } from "../components/dashboard/NoteEditor"

export default function StudyLobby() {
  return (
    <div className="grid grid-cols-12 gap-6 p-6 max-w-1600px mx-auto h-full">
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <Timer />
        <TodoList />
      </div>
      <div className="col-span-12 lg:col-span-8">
        <NoteEditor />
      </div>
    </div>
  );
}