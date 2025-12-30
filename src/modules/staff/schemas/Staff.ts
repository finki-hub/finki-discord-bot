import { z } from 'zod';

export const StaffSchema = z
  .object({
    active: z.string(),
    cabinet: z.string(),
    consultations: z.string(),
    courses: z.string(),
    email: z.string(),
    name: z.string(),
    position: z.string(),
    profile: z.string(),
    title: z.string(),
  })
  .transform((data) => ({
    ...data,
    active: data.active === 'TRUE',
  }));

export type Staff = z.infer<typeof StaffSchema>;
