import {
  type BotConfig,
  type BotConfigKeys,
} from '@/modules/admin/schemas/BotConfig.js';
import { Model } from '@/modules/chat/schemas/Model.js';

export const DEFAULT_CONFIGURATION = {
  channels: undefined,
  crossposting: {
    channels: [],
    enabled: false,
  },
  errorWebhook: undefined,
  models: {
    embeddings: Model.BGE_M3,
    inference: Model.LLAMA_3_3_70B,
  },
  roles: undefined,
  ticketing: {
    enabled: false,
    tickets: undefined,
  },
} as const satisfies BotConfig satisfies Record<BotConfigKeys, unknown>;
