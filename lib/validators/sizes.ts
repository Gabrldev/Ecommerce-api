import { z } from "zod";


export const SizesValidator = z.object({
  name: z.string().min(3).max(30),
  value: z.string().min(0).max(100),
});

export type SizesRequest = z.infer<typeof SizesValidator>;