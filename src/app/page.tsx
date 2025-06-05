import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Bem-vindo ao Gerenciador de Tarefas
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Organize suas tarefas de forma simples e eficiente
      </p>
      <div className="space-x-4">
        <Link
          href="/tasks"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
        >
          Ver Minhas Tarefas
        </Link>
        <Link
          href="/tasks/create"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-lg"
        >
          Criar Nova Tarefa
        </Link>
      </div>
    </div>
  );
}
