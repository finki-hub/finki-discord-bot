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

export const ChannelSchema = z.nativeEnum(Channel);

export enum TemporaryChannel {
  Regulars = 'regulars',
  VIP = 'vip',
}

export const TemporaryChannelSchema = z.nativeEnum(TemporaryChannel);
