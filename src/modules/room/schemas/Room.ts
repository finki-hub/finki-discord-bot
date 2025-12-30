import { z } from 'zod';

export const RoomSchema = z.object({
  capacity: z.union([z.number(), z.string()]),
  description: z.string(),
  floor: z.union([z.number(), z.string()]),
  location: z.string(),
  name: z.union([z.number(), z.string()]),
  type: z.string(),
});

export type Room = z.infer<typeof RoomSchema>;
