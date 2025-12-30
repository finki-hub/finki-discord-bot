import { z } from 'zod';

export const RoomSchema = z
  .object({
    capacity: z.string(),
    description: z.string(),
    floor: z.string(),
    location: z.string(),
    name: z.string(),
    type: z.string(),
  })
  .transform((data) => ({
    ...data,
    capacity: Number.parseInt(data.capacity),
    floor: Number.parseInt(data.floor),
  }));

export type Room = z.infer<typeof RoomSchema>;
