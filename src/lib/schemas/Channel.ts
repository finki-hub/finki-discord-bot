import { z } from 'zod';

export enum Channel {
  Activity = 'activity',
  Starboard = 'starboard',
  Tickets = 'tickets',
}

export const ChannelSchema = z.enum(Channel);
