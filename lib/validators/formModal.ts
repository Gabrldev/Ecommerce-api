import { z } from "zod";

export const formModalValidator = z.object({
  name: z.string().min(3).max(30),
});

export type FormModalRequest = z.infer<typeof formModalValidator>;
