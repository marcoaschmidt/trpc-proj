"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../trpc/react";
import Link from "next/link";

export default function TaskList() {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = api.tasks.getAll.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined;
      },
    }
  );

  const { mutate: deleteTask, isPending: isDeleting } =
    api.tasks.delete.useMutation({
      onSuccess: () => {
        setNotification({
          type: "success",
          message: "Tarefa excluída com sucesso!",
        });
        refetch();
        setTimeout(() => setNotification(null), 3000);
      },
      onError: (error) => {
        setNotification({ type: "error", message: error.message });
        setTimeout(() => setNotification(null), 3000);
      },
    });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir a tarefa "${title}"?`)) {
      deleteTask({ id });
    }
  };

  const observerRef = useRef<HTMLDivElement | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const debounceFetch = useCallback((fetchFn: () => void, delay = 1000) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      fetchFn();
    }, delay);
  }, []);

  useEffect(() => {
    const node = observerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          debounceFetch(fetchNextPage);
        }
      },
      { rootMargin: "100px", threshold: 1.0 }
    );

    observer.observe(node);

    return () => observer.unobserve(node);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, debounceFetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Erro ao carregar tarefas: {error.message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const allTasks = data?.pages.flatMap((page) => page.tasks) || [];

  return (
    <div className="space-y-4">
      {notification && (
        <div
          className={`p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}
      {allTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            Nenhuma tarefa encontrada
          </p>
          <Link
            href="/tasks/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Criar sua primeira tarefa
          </Link>
        </div>
      ) : (
        <>
          {allTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Criada em:{" "}
                    {new Date(task.createdAt).toLocaleDateString("pt-BR")} às{" "}
                    {new Date(task.createdAt).toLocaleTimeString("pt-BR")}
                  </p>
                  {task.updatedAt ? (
                    <p className="text-sm text-gray-500">
                      Atualizada em:{" "}
                      {new Date(task.updatedAt).toLocaleDateString("pt-BR")} às{" "}
                      {new Date(task.updatedAt).toLocaleTimeString("pt-BR")}
                    </p>
                  ) : null}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Link
                    href={`/tasks/edit/${task.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded hover:bg-blue-50"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(task.id, task.title)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 disabled:opacity-50"
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {hasNextPage && <div ref={observerRef} className="h-10 mt-48"></div>}
        </>
      )}
    </div>
  );
}
