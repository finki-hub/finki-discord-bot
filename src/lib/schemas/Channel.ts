import { z } from 'zod';

export enum Channel {
  Activity = 'activity',
  Logs = 'logs',
  Starboard = 'starboard',
  Tickets = 'tickets',
}

export const ChannelSchema = z.enum(Channel);
