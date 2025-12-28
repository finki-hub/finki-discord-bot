import { z } from 'zod';

export const TicketSchema = z.object({
  description: z.string().optional(),
  id: z.string(),
  name: z.string(),
  roles: z.array(z.string()),
});

export type Ticket = z.infer<typeof TicketSchema>;
