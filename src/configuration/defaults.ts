import {
  type BotConfig,
  type BotConfigKeys,
} from '../lib/schemas/BotConfig.js';
import { Model } from '../lib/schemas/Model.js';

export const DEFAULT_CONFIGURATION = {
  ads: undefined,
  channels: undefined,
  chatBotModel: Model.LLAMA_3_3_70B,
  crossposting: {
    channels: [],
    enabled: false,
  },
  experience: {
    enabled: false,
    multipliers: undefined,
  },
  guild: undefined,
  intervals: {
    buttonIdle: 60_000,
    ephemeralReply: 5_000,
    sendReminders: 15_000,
    ticketsCheck: 900_000,
  },
  oathEnabled: false,
  reactions: {
    add: undefined,
    remove: undefined,
  },
  roles: undefined,
  temporaryChannels: undefined,
  themeColor: '#313183',
  ticketing: {
    allowedInactivityDays: 10,
    enabled: false,
    tickets: undefined,
  },
} satisfies BotConfig satisfies Record<BotConfigKeys, unknown>;
