import { z } from "zod";
export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be at most 128 characters long"),
});
export type LoginSchema = z.infer<typeof loginSchema>;