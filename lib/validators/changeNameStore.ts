import { z } from "zod";

export const ChangeNameStoreValidator = z.object({
  name: z.string().min(3).max(30),
});

export type ChangeNameStoreRequest = z.infer<typeof ChangeNameStoreValidator>;
