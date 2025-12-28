import { logger } from '@/common/logger/index.js';
import { initializeChannels } from '@/common/services/channels.js';
import { initializeRoles } from '@/common/services/roles.js';
import { type BotConfigKeys } from '@/modules/admin/schemas/BotConfig.js';

export const refreshOnConfigChange = async (property: BotConfigKeys) => {
  logger.info(`Config property ${property} changed, refreshing...`);

  switch (property) {
    case 'channels':
      await initializeChannels();
      break;

    case 'roles':
      await initializeRoles();
      break;

    default:
      logger.info(`No refresh needed for ${property}`);
      break;
  }
};
