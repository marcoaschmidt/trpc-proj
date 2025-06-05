export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export const tasksDatabase: Task[] = [
  {
    id: "c4dcf27b-b9ff-4a0e-8e28-de339c2b8121",
    title: "Tarefa de exemplo",
    description: "Esta é uma tarefa de exemplo para demonstração",
    createdAt: new Date(),
  },
];

export const generateId = (): string => {
  return crypto.randomUUID();
};
