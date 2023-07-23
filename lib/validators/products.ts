import {z} from 'zod';

export const prodfuctsValidator = z.object({
  name: z.string().min(3).max(30),
  price: z.number().min(0),
});