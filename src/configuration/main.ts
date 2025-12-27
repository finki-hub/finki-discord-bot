import type { ColorResolvable } from 'discord.js';

import { getConfig, setConfig } from '../data/database/Config.js';
import {
  type BotConfig,
  type BotConfigKeys,
  BotConfigSchema,
  type FullyRequiredBotConfig,
} from '../lib/schemas/BotConfig.js';
import { logger } from '../logger.js';
import { configErrorFunctions } from '../translations/errors.js';
import { DEFAULT_CONFIGURATION } from './defaults.js';

type ConfigShape = NonNullable<BotConfig>;

let config: ConfigShape | undefined;

export const reloadDatabaseConfig = async () => {
  const currentConfig = await getConfig();

  try {
    const parsedConfig = BotConfigSchema.parse(
      currentConfig?.value ?? DEFAULT_CONFIGURATION,
    );
    config = parsedConfig ?? DEFAULT_CONFIGURATION;
  } catch (error) {
    const parsedConfig = BotConfigSchema.parse(DEFAULT_CONFIGURATION);
    config = parsedConfig ?? DEFAULT_CONFIGURATION;

    logger.warn(configErrorFunctions.invalidConfiguration(error));
  }
};

export const getConfigProperty = <T extends BotConfigKeys>(key: T) =>
  config?.[key] ?? DEFAULT_CONFIGURATION[key];

export const setConfigProperty = async <T extends BotConfigKeys>(
  key: T,
  value: ConfigShape[T],
) => {
  if (config === undefined) {
    return null;
  }

  config[key] = value;
  const newValue = await setConfig(config);

  return newValue?.value ?? null;
};

export const getConfigKeys = () => Object.keys(DEFAULT_CONFIGURATION);

export const getThemeColor = (): ColorResolvable =>
  config?.themeColor ?? 'Random';

export const getChannelsProperty = <
  T extends keyof FullyRequiredBotConfig['channels'],
>(
  key: T,
) => config?.channels?.[key];

export const getCrosspostingProperty = <
  T extends keyof FullyRequiredBotConfig['crossposting'],
>(
  key: T,
) => config?.crossposting?.[key];

export const getIntervalsProperty = <
  T extends keyof FullyRequiredBotConfig['intervals'],
>(
  key: T,
) => config?.intervals?.[key] ?? DEFAULT_CONFIGURATION.intervals[key];

export const getReactionsProperty = <
  T extends keyof FullyRequiredBotConfig['reactions'],
>(
  key: T,
) => config?.reactions?.[key];

export const getRolesProperty = <
  T extends keyof FullyRequiredBotConfig['roles'],
>(
  key: T,
) => config?.roles?.[key];

export const getTicketingProperty = <
  T extends keyof FullyRequiredBotConfig['ticketing'],
>(
  key: T,
) => config?.ticketing?.[key] ?? DEFAULT_CONFIGURATION.ticketing[key];

export const getTicketProperty = (key: string) => {
  const tickets = getTicketingProperty('tickets');

  return tickets?.find((ticket) => ticket.id === key);
};
