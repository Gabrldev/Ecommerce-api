import {z} from 'zod'

export const BillboardValidator = z.object({
  label: z.string().min(1).max(50),
  imageUrl: z.string().min(1).max(200),

})

export type BillboardRequest= z.infer<typeof BillboardValidator>