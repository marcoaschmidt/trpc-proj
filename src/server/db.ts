export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

const globalForTasks = globalThis as unknown as {
  tasksDatabase: Task[] | undefined;
};

export const tasksDatabase: Task[] = globalForTasks.tasksDatabase ?? [
  {
    id: "c4dcf27b-b9ff-4a0e-8e28-de339c2b8121",
    title: "Tarefa de exemplo",
    description: "Esta é uma tarefa de exemplo para demonstração",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: null,
    deletedAt: null,
  },
];

globalForTasks.tasksDatabase = tasksDatabase;

export const generateId = (): string => {
  return crypto.randomUUID();
};
