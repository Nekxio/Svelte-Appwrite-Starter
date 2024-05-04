import type { Models } from 'node-appwrite';
import { boolean, object, string, z } from 'zod';

export const todoIdSchema = object({ $id: z.string().min(1, "L'ID est requis") });

export const todoBaseSchema = object({
	title: string().min(1, 'Le titre est requis'),
	description: string().optional(),
	isComplete: boolean()
});

export const todoCreateSchema = todoBaseSchema;

export const todoUpdateStatusSchema = object({
	$id: todoIdSchema.shape.$id,
	isComplete: todoBaseSchema.shape.isComplete
});

export const todoUpdateSchema = object({
	$id: todoIdSchema.shape.$id,
	title: todoBaseSchema.shape.title,
	description: todoBaseSchema.shape.description
});

export type TodoBase = z.infer<typeof todoBaseSchema>;
export type TodoCreate = z.infer<typeof todoCreateSchema>;
export type TodoUpdateStatus = z.infer<typeof todoUpdateStatusSchema>;
export type TodoUpdate = z.infer<typeof todoUpdateSchema>;
export type TodoDelete = z.infer<typeof todoIdSchema>;

export type Todo = TodoBase & Models.Document;
