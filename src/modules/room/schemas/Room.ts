import { z } from 'zod';

export const RoomSchema = z.object({
  capacity: z.string(),
  description: z.string(),
  floor: z.string(),
  location: z.string(),
  name: z.string(),
  type: z.string(),
});

export type Room = z.infer<typeof RoomSchema>;
