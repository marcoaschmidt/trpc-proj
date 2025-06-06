import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { generateId, Task, tasksDatabase } from "@/server/db";

const createTaskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

const updateTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
});

export const tasksRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().min(0).default(0),
      })
    )
    .query(({ input }) => {
      const { limit, cursor } = input;

      const activeTasks = tasksDatabase.filter((t) => !t.deletedAt);

      const paginatedTasks = activeTasks
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(cursor, cursor + limit);

      const nextCursor =
        cursor + limit < activeTasks.length ? cursor + limit : null;

      return {
        tasks: paginatedTasks,
        total: activeTasks.length,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ input }) => {
      const task = tasksDatabase.find((t) => t.id === input.id && !t.deletedAt);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada",
        });
      }
      return task;
    }),

  create: publicProcedure.input(createTaskSchema).mutation(({ input }) => {
    const newTask: Task = {
      id: generateId(),
      title: input.title,
      description: input.description,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };
    tasksDatabase.push(newTask);
    return newTask;
  }),

  update: publicProcedure.input(updateTaskSchema).mutation(({ input }) => {
    const taskIndex = tasksDatabase.findIndex((t) => t.id === input.id);

    if (taskIndex === -1) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Tarefa não encontrada para atualização",
      });
    }

    tasksDatabase[taskIndex] = {
      ...tasksDatabase[taskIndex],
      title: input.title,
      description: input.description,
      updatedAt: new Date(),
    };

    return tasksDatabase[taskIndex];
  }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const task = tasksDatabase.find((t) => t.id === input.id);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada para exclusão",
        });
      }

      task.deletedAt = new Date();
      return task;
    }),
});
