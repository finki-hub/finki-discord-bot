import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { logger } from '@/common/logger/index.js';
import {
  type BotConfig,
  BotConfigSchema,
} from '@/modules/admin/schemas/BotConfig.js';
import { configErrorFunctions } from '@/translations/errors.js';

import { DEFAULT_CONFIGURATION } from './defaults.js';

const CONFIG_FILE_PATH = join(process.cwd(), 'config', 'bot.json');

// Convert undefined values to null for JSON serialization
const serializeConfig = (config: BotConfig): string =>
  JSON.stringify(
    config,
    (_, value: unknown) => (value === undefined ? null : value),
    2,
  );

// Convert null values back to undefined for Zod parsing
const deserializeConfig = (parsed: unknown): unknown => {
  if (parsed === null || typeof parsed !== 'object') {
    return parsed;
  }

  if (Array.isArray(parsed)) {
    return parsed.map(deserializeConfig);
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (value === null) {
      result[key] = undefined;
    } else if (typeof value === 'object') {
      result[key] = deserializeConfig(value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

export const getConfig = async (): Promise<BotConfig | null> => {
  try {
    const fileContent = await readFile(CONFIG_FILE_PATH, 'utf8');
    const parsed: unknown = JSON.parse(fileContent);
    const deserialized = deserializeConfig(parsed);

    return BotConfigSchema.parse(deserialized);
  } catch (error) {
    if (Error.isError(error) && error.name === 'SyntaxError') {
      return null;
    }

    // ENOENT means file doesn't exist - create it with default configuration
    if (Error.isError(error) && 'code' in error && error.code === 'ENOENT') {
      try {
        // Ensure config directory exists
        await mkdir(dirname(CONFIG_FILE_PATH), { recursive: true });

        // Create file with default configuration
        const defaultConfig = BotConfigSchema.parse(DEFAULT_CONFIGURATION);
        const jsonContent = serializeConfig(defaultConfig);
        await writeFile(CONFIG_FILE_PATH, jsonContent, 'utf8');

        logger.info('Created config/bot.json with default configuration');

        return defaultConfig;
      } catch (createError) {
        logger.error(
          `Failed creating config file with defaults\n${String(createError)}`,
        );
        return null;
      }
    }

    logger.error(`Failed reading config file\n${String(error)}`);

    return null;
  }
};

export const setConfig = async (
  config: BotConfig,
): Promise<BotConfig | null> => {
  try {
    const validated = BotConfigSchema.parse(config);
    const jsonContent = serializeConfig(validated);

    // Ensure config directory exists
    await mkdir(dirname(CONFIG_FILE_PATH), { recursive: true });

    await writeFile(CONFIG_FILE_PATH, jsonContent, 'utf8');

    logger.info('Configuration saved');

    return validated;
  } catch (error) {
    logger.error(`Failed writing config file\n${String(error)}`);
    logger.warn(configErrorFunctions.invalidConfiguration(error));

    return null;
  }
};
