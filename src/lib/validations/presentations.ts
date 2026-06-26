import { z } from "zod";

export const createPresentationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
});

export const updatePresentationSchema = z.object({
  title: z.string().min(1).max(200).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(["created_at", "updated_at", "title"]).nullable().default("updated_at"),
});

export type CreatePresentationInput = z.infer<typeof createPresentationSchema>;
export type UpdatePresentationInput = z.infer<typeof updatePresentationSchema>;
