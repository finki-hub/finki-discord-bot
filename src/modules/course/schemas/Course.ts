import { z } from 'zod';

export const CourseSchema = z
  .object({
    '2018-available': z.union([z.number(), z.string()]).optional(),
    '2018-code': z.string().optional(),
    '2018-level': z.union([z.number(), z.string()]).optional(),
    '2018-name': z.string().optional(),
    '2018-prerequisite': z.string().optional(),
    '2018-semester': z.union([z.number(), z.string()]).optional(),
    '2023-available': z.union([z.number(), z.string()]).optional(),
    '2023-code': z.string().optional(),
    '2023-level': z.union([z.number(), z.string()]).optional(),
    '2023-name': z.string().optional(),
    '2023-prerequisite': z.string().optional(),
    '2023-semester': z.union([z.number(), z.string()]).optional(),
    assistants: z.string(),
    name: z.string(),
    professors: z.string(),
  })
  .catchall(z.union([z.number(), z.string()]));

export type Course = z.infer<typeof CourseSchema>;
