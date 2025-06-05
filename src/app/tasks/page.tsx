import TaskList from "./TaskList";

export default async function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h2>
      </div>

      <TaskList />
    </div>
  );
}
