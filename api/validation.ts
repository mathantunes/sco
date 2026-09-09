import { z } from "zod";

export const deviceQuerySchema = z.object({
  deviceId: z.string().trim().min(1),
});

export const addItemBodySchema = z.object({
  productId: z.string().trim().min(1),
  quantity: z.number().int().min(1),
});

export const updateItemParamsSchema = z.object({
  itemId: z.string().trim().min(1),
});

export const updateItemBodySchema = z.object({
  quantity: z.number().int().min(0),
});

export const validationError = (error: z.ZodError) => ({
  error: "invalid request",
  details: error.issues,
});
