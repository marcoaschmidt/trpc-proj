import TaskForm from "../TaskForm";

export default function CreateTaskPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Criar Nova Tarefa</h2>
        <p className="text-gray-600 mt-2">
          Preencha os campos abaixo para criar uma nova tarefa
        </p>
      </div>

      <TaskForm />
    </div>
  );
}
