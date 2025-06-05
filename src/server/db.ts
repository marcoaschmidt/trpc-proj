export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
}

export const tasksDatabase: Task[] = [
  {
    id: "1",
    title: "Tarefa de exemplo",
    description: "Esta é uma tarefa de exemplo para demonstração",
    createdAt: new Date(),
  },
];

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
