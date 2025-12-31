import { z } from 'zod';

export const RoomSchema = z.object({
  capacity: z.string().optional(),
  description: z.string().optional(),
  floor: z.string().optional(),
  location: z.string(),
  mrbs: z.url().optional(),
  name: z.string(),
  type: z.string(),
});

export type Room = z.infer<typeof RoomSchema>;
