import TaskForm from "../../TaskForm";

interface EditTaskPageProps {
  params: {
    id: string;
  };
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Editar Tarefa</h2>
        <p className="text-gray-600 mt-2">
          Faça as alterações necessárias na sua tarefa
        </p>
      </div>

      <TaskForm taskId={params.id} />
    </div>
  );
}
