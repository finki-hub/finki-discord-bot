import { z } from 'zod';

export const RoomSchema = z
  .object({
    capacity: z.union([z.number(), z.string()]),
    classroom: z.union([z.number(), z.string()]),
    description: z.string(),
    floor: z.union([z.number(), z.string()]),
    location: z.string(),
    type: z.string(),
  })
  .strict();

export type Room = z.infer<typeof RoomSchema>;
