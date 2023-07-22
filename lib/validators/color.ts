import { z } from "zod";

export const colorValidator = z.object({
  name: z.string().min(3).max(20),
  value: z
    .string()
    .min(3)
    .max(20)
    .regex(/^#([0-9a-f]{3}){1,2}$/i, {
      message: "Invalid color value",
    }),
});

export type ColorRequest = z.infer<typeof colorValidator>;
