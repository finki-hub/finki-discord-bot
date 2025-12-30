import { z } from 'zod';

export const StaffSchema = z.object({
  active: z.union([z.number(), z.string()]),
  cabinet: z.union([z.number(), z.string()]),
  consultations: z.string(),
  courses: z.string(),
  email: z.string(),
  name: z.string(),
  position: z.string(),
  profile: z.string(),
  title: z.string(),
});

export type Staff = z.infer<typeof StaffSchema>;
