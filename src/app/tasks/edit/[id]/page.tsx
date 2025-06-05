import TaskForm from "../../TaskForm";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Editar Tarefa</h2>
        <p className="text-gray-600 mt-2">
          Faça as alterações necessárias na sua tarefa
        </p>
      </div>

      <TaskForm taskId={id} />
    </div>
  );
}
