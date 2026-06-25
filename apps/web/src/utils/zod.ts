import { z } from "astro/zod";

export const messageSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  message: z.string().min(1),
});
