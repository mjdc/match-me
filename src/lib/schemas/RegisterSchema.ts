import { z } from "zod";
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters long"),
  email: z
    .string()
    .email()
    .min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password must be at most 128 characters long"),
});
export type RegisterSchema = z.infer<typeof registerSchema>;