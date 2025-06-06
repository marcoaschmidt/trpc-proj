"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../../trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  taskId?: string;
}

export default function TaskForm({ taskId }: TaskFormProps) {
  const router = useRouter();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const isEditing = !!taskId;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const {
    data: existingTask,
    isLoading: isLoadingTask,
    isError,
  } = api.tasks.getById.useQuery(
    { id: taskId! },
    { enabled: isEditing, retry: 1, refetchOnWindowFocus: false }
  );

  const { mutate: createTask } = api.tasks.create.useMutation({
    onSuccess: () => {
      setNotification({
        type: "success",
        message: "Tarefa criada com sucesso!",
      });
      reset();
      setTimeout(() => {
        router.push("/tasks");
      }, 1500);
    },
    onError: (error) => {
      setNotification({ type: "error", message: error.message });
    },
  });

  const { mutate: updateTask } = api.tasks.update.useMutation({
    onSuccess: () => {
      setNotification({
        type: "success",
        message: "Tarefa atualizada com sucesso!",
      });
      setTimeout(() => {
        router.push("/tasks");
      }, 1500);
    },
    onError: (error) => {
      setNotification({ type: "error", message: error.message });
    },
  });

  useEffect(() => {
    if (existingTask && isEditing) {
      setValue("title", existingTask.title);
      setValue("description", existingTask.description || "");
    }
  }, [existingTask, isEditing, setValue]);

  const onSubmit = (data: TaskFormData) => {
    if (isEditing && taskId) {
      updateTask({
        id: taskId,
        title: data.title,
        description: data.description,
      });
    } else {
      createTask(data);
    }
  };

  if (isError) {
    return (
      <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
        Nenhuma tarefa encontrada
      </div>
    );
  }

  if (isEditing && isLoadingTask) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {notification && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Título *
          </label>
          <input
            type="text"
            id="title"
            {...register("title")}
            className={`w-full px-3 py-2 !text-black border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Digite o título da tarefa"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Descrição
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="w-full px-3 py-2 !text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Descreva sua tarefa (opcional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isEditing
                ? "Atualizando..."
                : "Criando..."
              : isEditing
              ? "Atualizar Tarefa"
              : "Criar Tarefa"}
          </button>
          <Link
            href="/tasks"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium text-center focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
