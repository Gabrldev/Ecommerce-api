import { z } from "zod";

export const CategoryValidator = z.object({
  name: z.string().min(1).max(50),
  billboardId: z.string().min(1),
});

export type CategoryRequest = z.infer<typeof CategoryValidator>;