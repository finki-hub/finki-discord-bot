import { z } from 'zod';

export enum Channel {
  Tickets = 'tickets',
}

export const ChannelSchema = z.enum(Channel);
