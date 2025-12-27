import { z } from 'zod';

import { ChannelSchema } from './Channel.js';
import { ModelSchema } from './Model.js';
import { RoleSchema } from './Role.js';
import { TicketSchema } from './Ticket.js';

const HexColorSchema = z.custom<`#${string}`>(
  (val) => typeof val === 'string' && /^#[\da-f]{6}$/iu.test(val),
);

const ModelsSchema = z.object({
  embeddings: ModelSchema.optional(),
  inference: ModelSchema.optional(),
});

export const RequiredBotConfigSchema = z.object({
  channels: z.record(ChannelSchema, z.string().optional()).optional(),
  crossposting: z
    .object({
      channels: z.array(z.string()).optional(),
      enabled: z.boolean().optional(),
    })
    .optional(),
  errorWebhook: z.url().optional(),
  guild: z.string().optional(),
  intervals: z
    .object({
      buttonIdle: z.number().optional(),
      ephemeralReply: z.number().optional(),
      sendReminders: z.number().optional(),
      ticketsCheck: z.number().optional(),
    })
    .optional(),
  models: ModelsSchema.optional(),
  reactions: z
    .object({
      add: z.record(z.string(), z.string()).optional(),
      remove: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  roles: z.record(RoleSchema, z.string()).optional(),
  themeColor: HexColorSchema.optional(),
  ticketing: z
    .object({
      allowedInactivityDays: z.number().optional(),
      enabled: z.boolean().optional(),
      tickets: z.array(TicketSchema).optional(),
    })
    .optional(),
});

export const BotConfigSchema = RequiredBotConfigSchema.optional();
export type BotConfig = z.infer<typeof BotConfigSchema>;

export const BotConfigKeysSchema = RequiredBotConfigSchema.keyof();
export type BotConfigKeys = keyof NonNullable<BotConfig>;

export const FullyRequiredBotConfigSchema = RequiredBotConfigSchema.required();
export type FullyRequiredBotConfig = z.infer<
  typeof FullyRequiredBotConfigSchema
>;
