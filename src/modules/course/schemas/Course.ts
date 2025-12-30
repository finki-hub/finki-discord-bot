import { z } from 'zod';

export const CourseSchema = z
  .object({
    '2018-available': z.string(),
    '2018-code': z.string(),
    '2018-level': z.string(),
    '2018-name': z.string(),
    '2018-prerequisite': z.string(),
    '2018-semester': z.string(),
    '2023-available': z.string(),
    '2023-code': z.string(),
    '2023-level': z.string(),
    '2023-name': z.string(),
    '2023-prerequisite': z.string(),
    '2023-semester': z.string(),
    assistants: z.string(),
    name: z.string(),
    professors: z.string(),
  })
  .catchall(z.string())
  .transform((data) => ({
    ...data,
    '2018-available': data['2018-available'] === 'TRUE',
    '2023-available': data['2023-available'] === 'TRUE',
    assistants: data.assistants
      .split(String.raw`\n`)
      .filter((name) => name.length > 0),
    professors: data.professors
      .split(String.raw`\n`)
      .filter((name) => name.length > 0),
  }));

export type Course = z.infer<typeof CourseSchema>;
