import { z } from 'zod';

export enum Channel {
  Activity = 'activity',
  Tickets = 'tickets',
}

export const ChannelSchema = z.enum(Channel);
