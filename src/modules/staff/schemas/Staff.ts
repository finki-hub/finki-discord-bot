import { z } from 'zod';

export const StaffSchema = z
  .object({
    active: z.string(),
    cabinet: z.string().optional(),
    consultations: z.url().optional(),
    courses: z.url().optional(),
    email: z.email(),
    name: z.string(),
    position: z.string(),
    profile: z.url().optional(),
    title: z.string(),
  })
  .transform((data) => ({
    ...data,
    active: data.active === 'TRUE',
  }));

export type Staff = z.infer<typeof StaffSchema>;
