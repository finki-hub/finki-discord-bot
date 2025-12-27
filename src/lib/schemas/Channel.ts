import { z } from 'zod';

export enum Channel {
  Activity = 'activity',
  Irregulars = 'irregulars',
  Logs = 'logs',
  Management = 'management',
  Oath = 'oath',
  Regulars = 'regulars',
  Starboard = 'starboard',
  Tickets = 'tickets',
  VIP = 'vip',
}

export const ChannelSchema = z.enum(Channel);
